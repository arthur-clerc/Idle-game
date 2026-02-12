/**
 * ProgressManager - Handles progress calculation logic
 * Manages level-based progress increments
 */
export class ProgressManager {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;

    // Progress levels configuration
    this.levels = {
      basic: { min: 0, max: 20000, color: '#523414', increment: 100 },
      iron: { min: 20000, max: 120000, color: '#b9b9b9', increment: 300 },
      gold: { min: 120000, max: 340000, color: '#c4a82c', increment: 500 },
      diamond: { min: 340000, max: 780000, color: '#33b9b4', increment: 900 },
      nezerit: { min: 780000, max: 1000000, color: '#4a234b', increment: 900 }
    };
  }

  /**
   * Update progress on enemy click
   */
  handleClick() {
    const currentProgress = this.gameState.getProgress();
    const level = this.getCurrentLevel(currentProgress);
    const increment = level ? level.increment : 100;

    this.gameState.addProgress(increment);
  }

  /**
   * Get current level based on progress
   * @param {number} progress - Current progress value
   * @returns {Object|null} Level object or null
   */
  getCurrentLevel(progress) {
    return Object.values(this.levels).find(
      level => progress >= level.min && progress <= level.max
    );
  }

  /**
   * Get current level color for progress bar
   * @returns {string} Color hex code
   */
  getCurrentColor() {
    const progress = this.gameState.getProgress();
    const level = Object.values(this.levels).reverse().find(
      l => progress >= l.min
    );
    return level ? level.color : this.levels.basic.color;
  }
}
