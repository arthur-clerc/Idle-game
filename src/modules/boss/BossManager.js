/**
 * BossManager - Handles boss spawning and combat
 */
export class BossManager {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;

    eventBus.on('boss:spawned', (boss) => this.onBossSpawned(boss));
    eventBus.on('boss:defeated', (reward) => this.onBossDefeated(reward));
  }

  /**
   * Handle enemy click with boss logic
   * @param {number} damage - Damage dealt
   */
  handleClick(damage) {
    const bossState = this.gameState.getBossState();

    if (bossState.active) {
      const defeated = this.gameState.damageBoss(damage);
      if (!defeated) {
        // Boss still alive, show damage
        this.eventBus.emit('boss:hitEffect', damage);
      }
    } else {
      // Count down to next boss
      this.gameState.decrementBossCounter();
    }
  }

  /**
   * Handle boss spawn
   * @param {Object} boss - Boss data
   */
  onBossSpawned(boss) {
    console.log('👹 Boss spawned! HP:', boss.maxHp, 'Reward:', boss.reward);
    this.showBossNotification(boss);
  }

  /**
   * Handle boss defeat
   * @param {number} reward - Reward amount
   */
  onBossDefeated(reward) {
    console.log('🎉 Boss defeated! Reward:', reward);
    this.showVictoryNotification(reward);
  }

  /**
   * Show boss spawn notification
   * @param {Object} boss - Boss data
   */
  showBossNotification(boss) {
    this.eventBus.emit('notification:show', {
      type: 'boss',
      title: 'Boss Appeared!',
      message: `HP: ${boss.maxHp} | Reward: ${boss.reward} gold`,
      icon: '👹'
    });
  }

  /**
   * Show victory notification
   * @param {number} reward - Reward amount
   */
  showVictoryNotification(reward) {
    this.eventBus.emit('notification:show', {
      type: 'victory',
      title: 'Boss Defeated!',
      message: `You earned ${reward.toLocaleString()} gold!`,
      icon: '🎉',
      reward: { type: 'gold', value: reward }
    });
  }
}
