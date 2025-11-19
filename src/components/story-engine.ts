import type { Story, Scene, Choice } from '../types/story.js';

/**
 * Story Engine - Manages the interactive story flow
 */
export class StoryEngine {
  private story: Story | null = null;
  private currentScene: Scene | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.container = document.getElementById('story-container');
  }

  /**
   * Load a story and prepare for playback
   */
  async loadStory(story: Story): Promise<void> {
    this.story = story;
    console.log('📚 Story loaded:', story.metadata.title);
  }

  /**
   * Start the story from the first scene
   */
  startStory(): void {
    if (!this.story || !this.container) {
      throw new Error('Story or container not initialized');
    }

    const firstScene = this.story.scenes[0];
    if (!firstScene) {
      throw new Error('No scenes found in story');
    }

    this.showScene(firstScene);
  }

  /**
   * Display a specific scene
   */
  private showScene(scene: Scene): void {
    if (!this.container || !this.story) {
      return;
    }

    this.currentScene = scene;
    console.log('🎭 Showing scene:', scene.id, '-', scene.title);

    // Build the scene HTML
    let html = `
      <div class="scene" data-scene-id="${scene.id}">
        <h2 class="scene-title">${scene.title}</h2>
    `;

    // Add characters if present
    if (scene.characters && scene.characters.length > 0) {
      const characterNames = scene.characters
        .map(charId => {
          const character = this.story!.characters[charId];
          return character ? character.name : charId;
        })
        .join(', ');

      html += `
        <div class="characters">
          <h4>Characters present:</h4>
          <div class="character-list">${characterNames}</div>
        </div>
      `;
    }

    // Add scene content
    html += `
      <div class="scene-content">
        ${this.formatContent(scene.content)}
      </div>
    `;

    // Add choices or continue button
    if (scene.choices && scene.choices.length > 0) {
      html += this.renderChoices(scene.choices);
    } else if (scene.next_scene) {
      html += `
        <button class="continue-button" onclick="window.storyEngine.goToScene('${scene.next_scene}')">
          Continue →
        </button>
      `;
    } else {
      html += `
        <div class="story-end">
          <h3>🎭 End of Chapter</h3>
          <p>Thank you for reading this chapter of Sir James Adventures!</p>
          <button class="continue-button" onclick="window.location.reload()">
            Start Over
          </button>
        </div>
      `;
    }

    html += '</div>';

    // Update the container
    this.container.innerHTML = html;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Make story engine globally accessible for button callbacks
    (window as unknown as { storyEngine: StoryEngine }).storyEngine = this;
  }

  /**
   * Navigate to a specific scene by ID
   */
  goToScene(sceneId: string): void {
    if (!this.story) {
      console.error('No story loaded');
      return;
    }

    const scene = this.story.scenes.find(s => s.id === sceneId);
    if (!scene) {
      console.error('Scene not found:', sceneId);
      return;
    }

    this.showScene(scene);
  }

  /**
   * Make a choice and proceed to the next scene
   */
  makeChoice(choiceId: string): void {
    if (!this.currentScene) {
      console.error('No current scene');
      return;
    }

    const choice = this.currentScene.choices?.find(c => c.id === choiceId);
    if (!choice) {
      console.error('Choice not found:', choiceId);
      return;
    }

    console.log(`🎯 Choice made: ${choice.text} (${choice.virtue})`);

    // Show choice consequence if available
    if (choice.consequence) {
      this.showChoiceConsequence(choice);
    }

    // Navigate to next scene
    if (choice.next_scene) {
      setTimeout(() => {
        this.goToScene(choice.next_scene!);
      }, choice.consequence ? 2000 : 500);
    }
  }

  /**
   * Show the consequence of a choice
   */
  private showChoiceConsequence(choice: Choice): void {
    if (!this.container) {
      return;
    }

    const consequenceDiv = document.createElement('div');
    consequenceDiv.className = 'choice-consequence';
    consequenceDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border: 2px solid #28a745;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        animation: fadeIn 0.5s ease-in;
      ">
        <h4 style="color: #28a745; margin-bottom: 0.5rem;">
          ✨ You chose ${choice.virtue}!
        </h4>
        <p>${choice.consequence}</p>
      </div>
    `;

    this.container.appendChild(consequenceDiv);
  }

  /**
   * Render choices as interactive buttons
   */
  private renderChoices(choices: Choice[]): string {
    let html = `
      <div class="choices">
        <h3>Choose your path:</h3>
    `;

    choices.forEach(choice => {
      html += `
        <button class="choice-button" onclick="window.storyEngine.makeChoice('${choice.id}')">
          ${choice.text}
          <span class="virtue-badge virtue-${choice.virtue}">${choice.virtue}</span>
        </button>
      `;
    });

    html += '</div>';
    return html;
  }

  /**
   * Format content text (convert newlines to paragraphs)
   */
  private formatContent(content: string): string {
    return content
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  }
}