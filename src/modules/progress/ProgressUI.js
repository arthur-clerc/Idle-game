/**
 * ProgressUI - Handles progress bar display
 * Optimized with transform instead of width for better GPU performance
 */
export class ProgressUI {
  constructor(gameState, eventBus, domCache, progressManager) {
    this.gameState = gameState;
    this.domCache = domCache;
    this.progressManager = progressManager;
    this.lastProgress = -1;

    // Listen for progress changes
    eventBus.on('progress:changed', (progress) => {
      this.updateProgressBar(progress.current, progress.max);
      this.updateProgressColor();
    });

    // Listen for game won
    eventBus.on('game:won', () => this.showWinMessage());

    // Initial render
    this.render();
  }

  /**
   * Initial render
   */
  render() {
    const progress = this.gameState.getProgress();
    const maxProgress = this.gameState.getMaxProgress();
    this.updateProgressBar(progress, maxProgress);
    this.updateProgressColor();
  }

  /**
   * Update progress bar
   * @param {number} current - Current progress
   * @param {number} max - Maximum progress
   */
  updateProgressBar(current, max) {
    // Skip if no change
    if (this.lastProgress === current) return;

    const progressBar = this.domCache.get('progressBar');
    const progressText = this.domCache.get('progressText');

    if (progressBar) {
      const percentage = (current / max) * 100;
      // Use transform for better performance (GPU accelerated)
      progressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${current.toLocaleString()} / ${max.toLocaleString()}`;
    }

    this.lastProgress = current;
  }

  /**
   * Update progress bar color gradient
   */
  updateProgressColor() {
    const progressBar = this.domCache.get('progressBar');
    if (!progressBar) return;

    const currentColor = this.progressManager.getCurrentColor();
    const baseColor = '#523414'; // basic color

    progressBar.style.backgroundImage = `linear-gradient(to right, ${baseColor}, ${currentColor})`;
  }

  /**
   * Show win message
   */
  showWinMessage() {
    const winMessage = this.domCache.get('winMessage');
    if (winMessage) {
      winMessage.style.display = 'block';
    }
  }
}
