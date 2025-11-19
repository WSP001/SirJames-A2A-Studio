# Story Format Documentation

## JSON Schema v3.0

Sir James Adventures uses a structured JSON format with schema validation to ensure story integrity.

## Schema Structure

### Version
All stories must specify version `"3.0"`:
```json
{
  "version": "3.0"
}
```

### Metadata
Required metadata fields:
```json
{
  "metadata": {
    "title": "Story Title",
    "book": "Book003",
    "chapter": "Chapter01", 
    "author": "Author Name",
    "created": "2024-09-24T20:16:00Z",
    "updated": "2024-09-24T20:16:00Z",
    "description": "Optional description",
    "tags": ["optional", "tags"]
  }
}
```

### Characters
Required characters with specific traits:
```json
{
  "characters": {
    "sir_james": {
      "name": "Sir James",
      "description": "Character description",
      "traits": {
        "eye_color": "blue",
        "personality": ["brave", "noble"]
      }
    },
    "sparky": {
      "name": "Sparky",
      "species": "squirrel", 
      "description": "Character description"
    }
  }
}
```

### Scenes
Scenes with specific ID pattern and types:
```json
{
  "scenes": [
    {
      "id": "ch01_s001",
      "scene_type": "narrative",
      "title": "Scene Title",
      "content": "Scene content...",
      "characters": ["sir_james", "sparky"],
      "next_scene": "ch01_s002"
    }
  ]
}
```

## Scene Types
- `narrative` - Story exposition
- `decision` - Interactive choice points
- `climax` - Dramatic conclusions
- `introduction` - Chapter openings
- `conclusion` - Chapter endings

## Scene ID Pattern
Scene IDs must follow the pattern: `^ch\d{2}_s\d{3}$`
- Example: `ch01_s001`, `ch01_s002`, `ch02_s001`

## Interactive Choices
Decision scenes can include choices with virtues:
```json
{
  "choices": [
    {
      "id": "choice_id",
      "text": "Choice description",
      "virtue": "courage",
      "next_scene": "ch01_s003",
      "consequence": "Optional consequence text"
    }
  ]
}
```

## Virtues
Three virtue types are supported:
- `courage` - Brave, bold actions
- `wisdom` - Thoughtful, intelligent choices  
- `trust` - Faith in others and cooperation

## Validation
Use the validation script to check story files:
```bash
npm run validate
npm run validate stories/your-story.json
```