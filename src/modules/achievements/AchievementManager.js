/**
 * AchievementManager - Handles achievement tracking and unlocking
 * Automatically checks conditions and unlocks achievements
 */
export class AchievementManager {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;

    // Listen for events that might trigger achievements
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for achievement triggers
   */
  setupEventListeners() {
    // Check achievements periodically
    this.eventBus.on('tick', () => this.checkAll());

    // Check on significant events
    this.eventBus.on('gold:changed', () => this.checkAll());
    this.eventBus.on('inventory:itemAdded', () => this.checkAll());
    this.eventBus.on('upgrade:purchased', () => this.checkAll());
    this.eventBus.on('boss:defeated', () => this.checkAll());
    this.eventBus.on('game:won', () => this.checkAll());
  }

  /**
   * Check all achievements
   */
  checkAll() {
    const achievementsData = this.gameState.getAchievementsData();
    if (!achievementsData) return;

    for (const achievementId in achievementsData) {
      const achievement = achievementsData[achievementId];

      if (!this.gameState.isAchievementUnlocked(achievementId)) {
        if (this.checkCondition(achievement.condition)) {
          this.unlockAchievement(achievementId, achievement);
        }
      }
    }
  }

  /**
   * Check if achievement condition is met
   * @param {Object} condition - Achievement condition
   * @returns {boolean}
   */
  checkCondition(condition) {
    const stats = this.gameState.getStats();

    switch(condition.type) {
      case 'clicks':
        return stats.totalClicks >= condition.value;

      case 'totalGoldEarned':
        return stats.totalGoldEarned >= condition.value;

      case 'itemsPurchased':
        return stats.itemsPurchased >= condition.value;

      case 'upgradesPurchased':
        return stats.upgradesPurchased >= condition.value;

      case 'chestsOpened':
        return stats.chestsOpened >= condition.value;

      case 'bossesDefeated':
        return stats.bossesDefeated >= condition.value;

      case 'timePlayed':
        return stats.timePlayed >= condition.value;

      case 'winTime':
        // Check if game was won and in under the time limit
        const progress = this.gameState.getProgress();
        const maxProgress = this.gameState.getMaxProgress();
        if (progress >= maxProgress) {
          return stats.timePlayed <= condition.value;
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Unlock an achievement
   * @param {string} achievementId - Achievement ID
   * @param {Object} achievement - Achievement data
   */
  unlockAchievement(achievementId, achievement) {
    const success = this.gameState.unlockAchievement(achievementId, achievement.reward);

    if (success) {
      console.log('🏆 Achievement unlocked:', achievement.name);
      this.showAchievementNotification(achievement);
    }
  }

  /**
   * Show achievement notification
   * @param {Object} achievement - Achievement data
   */
  showAchievementNotification(achievement) {
    this.eventBus.emit('notification:show', {
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: achievement.name,
      icon: achievement.icon,
      reward: achievement.reward
    });
  }

  /**
   * Get all achievements with their status
   * @returns {Array}
   */
  getAllAchievements() {
    const achievementsData = this.gameState.getAchievementsData();
    if (!achievementsData) return [];

    const achievements = [];
    const unlockedAchievements = this.gameState.getUnlockedAchievements();

    for (const achievementId in achievementsData) {
      const achievement = achievementsData[achievementId];
      const unlocked = !!unlockedAchievements[achievementId];
      const unlockedAt = unlockedAchievements[achievementId] || null;

      achievements.push({
        ...achievement,
        unlocked,
        unlockedAt,
        progress: this.getAchievementProgress(achievement)
      });
    }

    // Sort by tier and unlocked status
    return achievements.sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? 1 : -1;
      return 0;
    });
  }

  /**
   * Get achievement progress (0-100)
   * @param {Object} achievement - Achievement data
   * @returns {number}
   */
  getAchievementProgress(achievement) {
    const stats = this.gameState.getStats();
    let current = 0;

    switch(achievement.condition.type) {
      case 'clicks':
        current = stats.totalClicks;
        break;
      case 'totalGoldEarned':
        current = stats.totalGoldEarned;
        break;
      case 'itemsPurchased':
        current = stats.itemsPurchased;
        break;
      case 'upgradesPurchased':
        current = stats.upgradesPurchased;
        break;
      case 'chestsOpened':
        current = stats.chestsOpened;
        break;
      case 'bossesDefeated':
        current = stats.bossesDefeated;
        break;
      case 'timePlayed':
        current = stats.timePlayed;
        break;
      default:
        return 0;
    }

    return Math.min(100, Math.floor((current / achievement.condition.value) * 100));
  }
}
