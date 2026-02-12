/**
 * OfflineProgress - Calculate and reward offline gold earnings
 */
export class OfflineProgress {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;
  }

  /**
   * Calculate offline earnings
   * @returns {Object} Offline earnings data
   */
  calculateOfflineEarnings() {
    const now = Date.now();
    const lastSave = this.gameState.getStats().lastSaveTime;
    const offlineTime = Math.floor((now - lastSave) / 1000); // In seconds

    // Maximum 24 hours of offline progress
    const cappedTime = Math.min(offlineTime, 24 * 3600);

    // Calculate gold earned
    const goldPerSec = this.gameState.getGoldPerSec();
    const offlineGold = goldPerSec * cappedTime;

    return {
      timeAway: offlineTime,
      cappedTime,
      goldEarned: offlineGold
    };
  }

  /**
   * Apply offline earnings
   */
  applyOfflineEarnings() {
    const earnings = this.calculateOfflineEarnings();

    // Only show if away for more than 60 seconds and earned something
    if (earnings.timeAway > 60 && earnings.goldEarned > 0) {
      this.gameState.addGold(earnings.goldEarned);

      // Show notification
      this.eventBus.emit('notification:show', {
        type: 'offline',
        title: 'Welcome Back!',
        message: `You were away for ${this.formatTime(earnings.timeAway)}`,
        icon: '⏰',
        reward: {
          type: 'gold',
          value: earnings.goldEarned
        }
      });

      console.log('💰 Offline earnings:', earnings.goldEarned, 'gold for', earnings.timeAway, 'seconds');
    }
  }

  /**
   * Format time
   * @param {number} seconds - Time in seconds
   * @returns {string}
   */
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }
}
