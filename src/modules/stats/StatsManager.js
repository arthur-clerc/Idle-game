/**
 * StatsManager - Tracks and displays game statistics
 */
export class StatsManager {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;

    // Update time played periodically
    eventBus.on('tick', () => {
      gameState.updateTimePlayed();
    });
  }

  /**
   * Get formatted stats for display
   * @returns {Object}
   */
  getFormattedStats() {
    const stats = this.gameState.getStats();
    const prestige = this.gameState.getPrestigeData();

    return {
      'Total Clicks': stats.totalClicks.toLocaleString(),
      'Total Gold Earned': stats.totalGoldEarned.toLocaleString() + ' 💰',
      'Items Purchased': stats.itemsPurchased,
      'Upgrades Purchased': stats.upgradesPurchased,
      'Chests Opened': stats.chestsOpened,
      'Bosses Defeated': stats.bossesDefeated,
      'Time Played': this.formatTime(stats.timePlayed),
      'Prestige Level': prestige.level,
      'Prestige Points': prestige.points,
      'Total Runs': prestige.totalRuns
    };
  }

  /**
   * Format time in seconds to readable format
   * @param {number} seconds - Time in seconds
   * @returns {string}
   */
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  /**
   * Calculate DPS (damage per second)
   * @returns {number}
   */
  calculateDPS() {
    const goldPerClick = this.gameState.getGoldPerClick();
    const autoClickRate = this.gameState.getUpgradeMultipliers().autoClickRate;
    return goldPerClick * autoClickRate;
  }
}
