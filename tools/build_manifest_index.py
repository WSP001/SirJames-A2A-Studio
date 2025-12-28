#!/usr/bin/env python3
"""
Build a single searchable manifest of Sir James Adventures content.

Outputs:
  - assets/manifests/project.index.json
  - assets/manifests/project.index.csv
  - assets/manifests/project.index.html (interactive table)

Discovers:
  - Chapter/Scene from filenames and JSON
  - Paths to Markdown + JSON
  - Character lines (Narrator, Sir James, Claude, Gramps, Sparky)
  - Virtues (Courage/Wisdom/Trust) if present
  - Claude thought bubble presence (markdown italics or 💭)
  - Image/audio directories by convention

Usage:
  python tools/build_manifest_index.py [root_path]

Commons Good Compliance:
  - Cost: $0 (local indexing only)
  - Attribution: Part of Sir James A2A Studio
  - Transparency: Generates human-readable manifests
  - Privacy: No PII processed
"""

from __future__ import annotations
import re
import json
import csv
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

# Default paths
ROOT_DEFAULT = Path(".")
OUT_DIR = Path("assets/manifests")
OUT_JSON = OUT_DIR / "project.index.json"
OUT_CSV = OUT_DIR / "project.index.csv"
OUT_HTML = OUT_DIR / "project.index.html"

# Patterns for file discovery
CHAPTER_MD_PATTERN = re.compile(r"Chapter(\d{1,2})_Scene(\d{1,2})\.md$", re.IGNORECASE)
CHAPTER_JSON_PATTERN = re.compile(r"Chapter(\d{1,2})\.json$", re.IGNORECASE)
SCENE_DIR_PATTERN = re.compile(r"scene-(\d{3})", re.IGNORECASE)
NARRATION_BATCH_PATTERN = re.compile(r"_narration_batch\.json$", re.IGNORECASE)

# Character keys for dialogue extraction
CHAR_KEYS = ["narrator", "sir_james", "claude", "gramps", "sparky", "king_arthur"]


def find_md_files(root: Path) -> List[Path]:
    """Find Markdown script files."""
    md_dir = root / "Writer" / "Markdown"
    if md_dir.exists():
        return sorted(md_dir.rglob("Chapter*_*Scene*.md"))
    return []


def find_json_files(root: Path) -> List[Path]:
    """Find Chapter JSON files in Resources."""
    res_dir = root / "Resources"
    if res_dir.exists():
        return sorted(res_dir.glob("Chapter*.json"))
    return []


def find_book002_content(root: Path) -> List[Dict[str, Any]]:
    """Find Book002 content from public-book002 structure."""
    book_dir = root / "public-book002"
    if not book_dir.exists():
        return []
    
    content = []
    chapters_json = book_dir / "chapters.json"
    
    # Load chapters metadata if available
    chapters_meta = {}
    if chapters_json.exists():
        try:
            data = json.loads(chapters_json.read_text(encoding="utf-8"))
            for ch in data.get("chapters", []):
                chapters_meta[ch.get("id")] = ch
        except Exception:
            pass
    
    # Scan chapter directories
    for chapter_dir in sorted(book_dir.glob("chapter*")):
        if not chapter_dir.is_dir():
            continue
        
        # Extract chapter number
        match = re.search(r"chapter(\d+)", chapter_dir.name, re.IGNORECASE)
        if not match:
            continue
        chapter_num = int(match.group(1))
        
        # Get chapter metadata
        meta = chapters_meta.get(chapter_num, {})
        
        # Find narration batch
        narration_file = chapter_dir / "_narration_batch.json"
        narration_data = None
        if narration_file.exists():
            try:
                narration_data = json.loads(narration_file.read_text(encoding="utf-8"))
            except Exception:
                pass
        
        # Find scene directories
        for scene_dir in sorted(chapter_dir.glob("scene-*")):
            if not scene_dir.is_dir():
                continue
            
            scene_match = SCENE_DIR_PATTERN.search(scene_dir.name)
            if not scene_match:
                continue
            scene_num = int(scene_match.group(1))
            
            # Check for HTML
            html_file = scene_dir / "index.html"
            has_html = html_file.exists()
            
            # Extract dialogue from narration batch
            dialogue = {k: "" for k in CHAR_KEYS}
            virtues = []
            claude_thought = False
            
            if narration_data and "scenes" in narration_data:
                for scene in narration_data["scenes"]:
                    if scene.get("scene_number") == scene_num:
                        lines = scene.get("lines", [])
                        for line in lines:
                            char = line.get("character", "").lower().replace(" ", "_")
                            text = line.get("text", "")
                            if char in dialogue:
                                if dialogue[char]:
                                    dialogue[char] += " | " + text
                                else:
                                    dialogue[char] = text
                            # Check for Claude thought bubble
                            if char == "claude" and ("💭" in text or "thought" in text.lower()):
                                claude_thought = True
                        break
            
            # Check images
            images_dir = chapter_dir / "images"
            scene_image = images_dir / f"scene-{scene_num:03d}.png"
            has_image = scene_image.exists() if images_dir.exists() else False
            
            # Check audio
            audio_dir = chapter_dir / "audio"
            has_audio = audio_dir.exists() and any(audio_dir.glob("*.mp3"))
            
            content.append({
                "book": "book002",
                "chapter": chapter_num,
                "scene": scene_num,
                "title": meta.get("title", f"Chapter {chapter_num}"),
                "theme": meta.get("theme", ""),
                "virtue": meta.get("virtue", ""),
                "chapter_dir": str(chapter_dir),
                "scene_dir": str(scene_dir),
                "html_path": str(html_file) if has_html else "",
                "images_dir": str(images_dir) if images_dir.exists() else "",
                "audio_dir": str(audio_dir) if audio_dir.exists() else "",
                "has_html": has_html,
                "has_image": has_image,
                "has_audio": has_audio,
                "narrator": dialogue.get("narrator", ""),
                "sir_james": dialogue.get("sir_james", ""),
                "claude": dialogue.get("claude", ""),
                "gramps": dialogue.get("gramps", ""),
                "sparky": dialogue.get("sparky", ""),
                "king_arthur": dialogue.get("king_arthur", ""),
                "virtues": virtues,
                "claude_thought_bubble": claude_thought,
            })
    
    return content


def parse_chapter_scene_from_md(p: Path) -> Optional[Dict[str, int]]:
    """Extract chapter and scene numbers from markdown filename."""
    m = CHAPTER_MD_PATTERN.search(p.name)
    if not m:
        return None
    return {"chapter": int(m.group(1)), "scene": int(m.group(2))}


def parse_chapter_from_json(p: Path) -> Optional[int]:
    """Extract chapter number from JSON filename."""
    m = CHAPTER_JSON_PATTERN.search(p.name)
    return int(m.group(1)) if m else None


def load_json_safe(p: Path) -> Optional[Dict[str, Any]]:
    """Safely load JSON file."""
    try:
        return json.loads(p.read_text(encoding="utf-8-sig"))
    except Exception:
        return None


def extract_dialog_from_json(js: Dict[str, Any]) -> Dict[str, str]:
    """Extract character dialogue from JSON structure."""
    out = {k: "" for k in CHAR_KEYS}
    dlg = js.get("dialogue") or js.get("dialog") or {}
    for k in CHAR_KEYS:
        val = dlg.get(k) or dlg.get(k.capitalize()) or dlg.get(k.replace("_", " ").title()) or ""
        if isinstance(val, str):
            out[k] = val.strip()
    return out


def virtues_from_json(js: Dict[str, Any]) -> List[str]:
    """Extract virtues list from JSON."""
    v = js.get("virtues") or []
    if isinstance(v, list):
        return [str(x).lower() for x in v]
    return []


def detect_claude_thought_bubble(text: str) -> bool:
    """Detect Claude's telepathic thought bubble markers."""
    if "Claude" not in text and "claude" not in text.lower():
        return False
    
    markers = ["💭", "thought bubble", "telepathic", "telepathy", "(thought)"]
    low = text.lower()
    
    for marker in markers:
        if marker.lower() in low:
            return True
    
    # Check for italicized Claude line pattern
    italic_pattern = re.search(r"(?i)\*\*?\s*Claude[^\n]*\*\*?.*\n\s*\*[^*].+\*", text)
    return bool(italic_pattern)


def guess_asset_dirs(root: Path, chapter: int) -> Dict[str, str]:
    """Find asset directories for a chapter."""
    candidates = [
        (root / "public-book002" / f"chapter{chapter:02d}" / "images", "images"),
        (root / "public-book002" / f"chapter{chapter:02d}" / "audio", "audio"),
        (root / "assets" / "images" / f"chapter{chapter:02d}", "images"),
        (root / "assets" / "audio" / f"chapter{chapter:02d}", "audio"),
    ]
    
    out = {"images_dir": "", "audio_dir": ""}
    for path, kind in candidates:
        if path.exists():
            if kind == "images" and not out["images_dir"]:
                out["images_dir"] = str(path)
            if kind == "audio" and not out["audio_dir"]:
                out["audio_dir"] = str(path)
    return out


def generate_html_report(index: List[Dict[str, Any]], output_path: Path):
    """Generate interactive HTML manifest table."""
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sir James Adventures - Content Manifest</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            min-height: 100vh;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #ffd700;
            margin-bottom: 10px;
        }
        .stats {
            text-align: center;
            color: #a0c4ff;
            margin-bottom: 20px;
        }
        .filters {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            justify-content: center;
        }
        input, select {
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #444;
            background: #2a2a4a;
            color: #fff;
            font-size: 14px;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #ffd700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(0,0,0,0.3);
            border-radius: 12px;
            overflow: hidden;
        }
        th {
            background: rgba(255,215,0,0.2);
            color: #ffd700;
            padding: 12px 8px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }
        td {
            padding: 10px 8px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            font-size: 13px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        tr:hover { background: rgba(255,215,0,0.1); }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }
        .badge-yes { background: #2ecc71; color: #fff; }
        .badge-no { background: #e74c3c; color: #fff; }
        .badge-chapter { background: #3498db; color: #fff; }
        .badge-virtue { background: #9b59b6; color: #fff; }
        .thought-bubble { color: #ffd700; }
        .char-line {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        .char-line:hover {
            white-space: normal;
            background: rgba(0,0,0,0.5);
            position: relative;
            z-index: 10;
        }
        .hidden { display: none; }
        @media (max-width: 1200px) {
            .hide-mobile { display: none; }
        }
    </style>
</head>
<body>
    <h1>📚 Sir James Adventures - Content Manifest</h1>
    <div class="stats" id="stats"></div>
    
    <div class="filters">
        <input type="text" id="search" placeholder="🔍 Search all content..." style="width: 250px;">
        <select id="chapterFilter">
            <option value="">All Chapters</option>
        </select>
        <select id="claudeFilter">
            <option value="">Claude 💭 Filter</option>
            <option value="yes">Has Thought Bubble</option>
            <option value="no">No Thought Bubble</option>
        </select>
        <select id="assetFilter">
            <option value="">Asset Status</option>
            <option value="complete">Complete (HTML+Image+Audio)</option>
            <option value="missing">Missing Assets</option>
        </select>
    </div>
    
    <table id="manifestTable">
        <thead>
            <tr>
                <th>Ch</th>
                <th>Scene</th>
                <th>Title</th>
                <th>Virtue</th>
                <th>HTML</th>
                <th>Image</th>
                <th>Audio</th>
                <th>Claude 💭</th>
                <th class="hide-mobile">Sir James</th>
                <th class="hide-mobile">Claude</th>
                <th class="hide-mobile">Narrator</th>
            </tr>
        </thead>
        <tbody id="tableBody">
        </tbody>
    </table>

    <script>
        const data = MANIFEST_DATA_PLACEHOLDER;
        
        function renderTable(items) {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = items.map(item => `
                <tr>
                    <td><span class="badge badge-chapter">${item.chapter}</span></td>
                    <td>${item.scene}</td>
                    <td>${item.title || ''}</td>
                    <td>${item.virtue ? `<span class="badge badge-virtue">${item.virtue}</span>` : ''}</td>
                    <td><span class="badge ${item.has_html ? 'badge-yes' : 'badge-no'}">${item.has_html ? '✓' : '✗'}</span></td>
                    <td><span class="badge ${item.has_image ? 'badge-yes' : 'badge-no'}">${item.has_image ? '✓' : '✗'}</span></td>
                    <td><span class="badge ${item.has_audio ? 'badge-yes' : 'badge-no'}">${item.has_audio ? '✓' : '✗'}</span></td>
                    <td>${item.claude_thought_bubble ? '<span class="thought-bubble">💭</span>' : ''}</td>
                    <td class="char-line hide-mobile" title="${(item.sir_james || '').replace(/"/g, '&quot;')}">${item.sir_james || '-'}</td>
                    <td class="char-line hide-mobile" title="${(item.claude || '').replace(/"/g, '&quot;')}">${item.claude || '-'}</td>
                    <td class="char-line hide-mobile" title="${(item.narrator || '').replace(/"/g, '&quot;')}">${item.narrator || '-'}</td>
                </tr>
            `).join('');
            
            // Update stats
            const complete = items.filter(i => i.has_html && i.has_image && i.has_audio).length;
            document.getElementById('stats').innerHTML = 
                `${items.length} scenes | ${complete} complete | Generated: ${new Date().toLocaleDateString()}`;
        }
        
        function populateFilters() {
            const chapters = [...new Set(data.map(d => d.chapter))].sort((a,b) => a-b);
            const select = document.getElementById('chapterFilter');
            chapters.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch;
                opt.textContent = `Chapter ${ch}`;
                select.appendChild(opt);
            });
        }
        
        function filterData() {
            const search = document.getElementById('search').value.toLowerCase();
            const chapter = document.getElementById('chapterFilter').value;
            const claude = document.getElementById('claudeFilter').value;
            const asset = document.getElementById('assetFilter').value;
            
            let filtered = data.filter(item => {
                // Search filter
                if (search) {
                    const searchable = [
                        item.title, item.narrator, item.sir_james, 
                        item.claude, item.gramps, item.virtue
                    ].join(' ').toLowerCase();
                    if (!searchable.includes(search)) return false;
                }
                
                // Chapter filter
                if (chapter && item.chapter != chapter) return false;
                
                // Claude filter
                if (claude === 'yes' && !item.claude_thought_bubble) return false;
                if (claude === 'no' && item.claude_thought_bubble) return false;
                
                // Asset filter
                if (asset === 'complete' && !(item.has_html && item.has_image && item.has_audio)) return false;
                if (asset === 'missing' && (item.has_html && item.has_image && item.has_audio)) return false;
                
                return true;
            });
            
            renderTable(filtered);
        }
        
        // Initialize
        populateFilters();
        renderTable(data);
        
        // Event listeners
        document.getElementById('search').addEventListener('input', filterData);
        document.getElementById('chapterFilter').addEventListener('change', filterData);
        document.getElementById('claudeFilter').addEventListener('change', filterData);
        document.getElementById('assetFilter').addEventListener('change', filterData);
    </script>
</body>
</html>"""
    
    # Inject data
    html = html.replace('MANIFEST_DATA_PLACEHOLDER', json.dumps(index, ensure_ascii=False))
    output_path.write_text(html, encoding="utf-8")


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT_DEFAULT
    root = root.resolve()
    
    print(f"[SCAN] Scanning: {root}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    index: List[Dict[str, Any]] = []
    
    # 1. Find Book002 content (primary source)
    book002_content = find_book002_content(root)
    if book002_content:
        print(f"  [OK] Found {len(book002_content)} Book002 scenes")
        index.extend(book002_content)
    
    # 2. Find legacy Markdown files
    md_files = find_md_files(root)
    json_files = find_json_files(root)
    
    if md_files:
        print(f"  [OK] Found {len(md_files)} Markdown scripts")
        
        # Map chapter -> JSON path
        json_by_chapter: Dict[int, Path] = {}
        for j in json_files:
            ch = parse_chapter_from_json(j)
            if ch is not None:
                json_by_chapter[ch] = j
        
        for md in md_files:
            info = parse_chapter_scene_from_md(md)
            if not info:
                continue
            
            chapter = info["chapter"]
            scene = info["scene"]
            
            # Skip if already in Book002 content
            if any(i["chapter"] == chapter and i["scene"] == scene for i in index):
                continue
            
            scene_json = json_by_chapter.get(chapter)
            js = load_json_safe(scene_json) if scene_json else None
            
            dialog = {k: "" for k in CHAR_KEYS}
            virtues = []
            
            if js:
                scene_key = f"scene_{scene:02d}"
                if scene_key in js:
                    dialog = extract_dialog_from_json(js[scene_key])
                    virtues = virtues_from_json(js[scene_key])
                else:
                    dialog = extract_dialog_from_json(js)
                    virtues = virtues_from_json(js)
            
            md_text = ""
            try:
                md_text = md.read_text(encoding="utf-8")
            except Exception:
                pass
            
            claude_thought = detect_claude_thought_bubble(md_text)
            assets = guess_asset_dirs(root, chapter)
            
            row = {
                "book": "book001",
                "chapter": chapter,
                "scene": scene,
                "title": "",
                "theme": "",
                "virtue": "",
                "markdown_path": str(md),
                "json_path": str(scene_json) if scene_json else "",
                "images_dir": assets["images_dir"],
                "audio_dir": assets["audio_dir"],
                "has_html": False,
                "has_image": bool(assets["images_dir"]),
                "has_audio": bool(assets["audio_dir"]),
                "narrator": dialog.get("narrator", ""),
                "sir_james": dialog.get("sir_james", ""),
                "claude": dialog.get("claude", ""),
                "gramps": dialog.get("gramps", ""),
                "sparky": dialog.get("sparky", ""),
                "king_arthur": dialog.get("king_arthur", ""),
                "virtues": virtues,
                "claude_thought_bubble": claude_thought,
            }
            index.append(row)
    
    # Sort by chapter, then scene
    index.sort(key=lambda r: (r.get("book", ""), r["chapter"], r["scene"]))
    
    if not index:
        print("[WARN] No content found. Check your directory structure.")
        return
    
    # Generate outputs
    manifest = {
        "generated": datetime.now().isoformat(),
        "root": str(root),
        "total_scenes": len(index),
        "chapters": len(set(i["chapter"] for i in index)),
        "complete_scenes": len([i for i in index if i.get("has_html") and i.get("has_image") and i.get("has_audio")]),
        "claude_thought_bubbles": len([i for i in index if i.get("claude_thought_bubble")]),
        "items": index
    }
    
    # Write JSON
    OUT_JSON.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[OK] Wrote {OUT_JSON}")
    
    # Write CSV
    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "book", "chapter", "scene", "title", "virtue", 
            "has_html", "has_image", "has_audio", "claude_thought_bubble",
            "narrator", "sir_james", "claude", "gramps", "sparky"
        ])
        for r in index:
            w.writerow([
                r.get("book", ""),
                r["chapter"],
                r["scene"],
                r.get("title", ""),
                r.get("virtue", ""),
                "yes" if r.get("has_html") else "no",
                "yes" if r.get("has_image") else "no",
                "yes" if r.get("has_audio") else "no",
                "yes" if r.get("claude_thought_bubble") else "no",
                r.get("narrator", ""),
                r.get("sir_james", ""),
                r.get("claude", ""),
                r.get("gramps", ""),
                r.get("sparky", ""),
            ])
    print(f"[OK] Wrote {OUT_CSV}")
    
    # Write HTML
    generate_html_report(index, OUT_HTML)
    print(f"[OK] Wrote {OUT_HTML}")
    
    # Summary
    print(f"\n[SUMMARY]")
    print(f"   Total scenes: {manifest['total_scenes']}")
    print(f"   Chapters: {manifest['chapters']}")
    print(f"   Complete (HTML+Image+Audio): {manifest['complete_scenes']}")
    print(f"   Claude thought bubbles: {manifest['claude_thought_bubbles']}")


if __name__ == "__main__":
    main()
