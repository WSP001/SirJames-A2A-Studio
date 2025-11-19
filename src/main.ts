import './style.css';
import { StoryEngine } from './components/story-engine.js';
import type { Story } from './types/story.js';

/**
 * Main application entry point
 */
class SirJamesAdventures {
  private storyEngine: StoryEngine;

  constructor() {
    this.storyEngine = new StoryEngine();
  }

  async initialize(): Promise<void> {
    console.log('🏰 Initializing Sir James Adventures Book 003');
    
    try {
      // Load the story data
      const response = await fetch('/stories/book003-chapter01.json');
      if (!response.ok) {
        throw new Error(`Failed to load story: ${response.statusText}`);
      }
      
      const storyData: Story = await response.json();
      console.log('📖 Story loaded:', storyData.metadata.title);
      
      // Initialize the story engine
      await this.storyEngine.loadStory(storyData);
      
      // Start the story
      this.storyEngine.startStory();
      
    } catch (error) {
      console.error('❌ Failed to initialize story:', error);
      this.showError('Failed to load the story. Please try refreshing the page.');
    }
  }

  private showError(message: string): void {
    const container = document.getElementById('story-container');
    if (container) {
      container.innerHTML = `
        <div class="error">
          <h3>⚠️ Error</h3>
          <p>${message}</p>
          <button onclick="window.location.reload()">Reload Page</button>
        </div>
      `;
    }
  }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new SirJamesAdventures();
  app.initialize();
});