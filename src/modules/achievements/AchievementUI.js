/**
 * AchievementUI - Displays achievements and notifications
 */
export class AchievementUI {
  constructor(gameState, eventBus, domCache, achievementManager) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;
    this.achievementManager = achievementManager;

    // Listen for achievement unlocks
    eventBus.on('achievement:unlocked', (id) => this.onAchievementUnlocked(id));
    eventBus.on('notification:show', (data) => this.showNotification(data));
    eventBus.on('state:loaded', () => this.render());
  }

  /**
   * Initialize achievements display
   */
  initialize() {
    this.render();
  }

  /**
   * Render achievements panel
   */
  render() {
    const container = this.domCache.get('achievementsContainer');
    if (!container) return;

    container.innerHTML = '';
    const achievements = this.achievementManager.getAllAchievements();

    achievements.forEach(achievement => {
      const element = this.createAchievementElement(achievement);
      container.appendChild(element);
    });
  }

  /**
   * Create achievement element
   * @param {Object} achievement - Achievement data
   * @returns {HTMLElement}
   */
  createAchievementElement(achievement) {
    const div = document.createElement('div');
    div.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} tier-${achievement.tier}`;
    div.dataset.achievementId = achievement.id;

    div.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${!achievement.unlocked ? `<div class="achievement-progress">${achievement.progress}%</div>` : ''}
        <div class="achievement-reward">
          ${this.formatReward(achievement.reward)}
        </div>
      </div>
      ${achievement.unlocked ? '<div class="achievement-checkmark">✓</div>' : ''}
    `;

    return div;
  }

  /**
   * Format reward text
   * @param {Object} reward - Reward data
   * @returns {string}
   */
  formatReward(reward) {
    if (reward.type === 'gold') {
      return `💰 +${reward.value.toLocaleString()} Gold`;
    } else if (reward.type === 'multiplier') {
      return `⚡ x${reward.value} Multiplier`;
    }
    return '';
  }

  /**
   * Handle achievement unlock
   * @param {string} achievementId - Achievement ID
   */
  onAchievementUnlocked(achievementId) {
    const item = document.querySelector(`[data-achievement-id="${achievementId}"]`);
    if (item) {
      item.classList.remove('locked');
      item.classList.add('unlocked', 'just-unlocked');
      setTimeout(() => item.classList.remove('just-unlocked'), 2000);
    }

    // Update full display
    setTimeout(() => this.render(), 2000);
  }

  /**
   * Show notification popup
   * @param {Object} data - Notification data
   */
  showNotification(data) {
    const notification = document.createElement('div');
    notification.className = 'notification achievement-notification';
    notification.innerHTML = `
      <div class="notification-icon">${data.icon}</div>
      <div class="notification-content">
        <div class="notification-title">${data.title}</div>
        <div class="notification-message">${data.message}</div>
        <div class="notification-reward">${this.formatReward(data.reward)}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
  }
}
