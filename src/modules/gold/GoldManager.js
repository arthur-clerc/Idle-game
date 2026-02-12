/**
 * GoldManager - Handles all gold-related logic
 * Centralized gold calculations and state updates
 */
export class GoldManager {
  constructor(gameState, eventBus, animationLoop, effectsManager = null, bossManager = null) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.effectsManager = effectsManager;
    this.bossManager = bossManager;

    // Listen for tick events to add gold/sec and auto-click
    eventBus.on('tick', () => this.handleTick());
  }

  /**
   * Handle animation loop tick (every second)
   * Adds gold per second and handles auto-click
   */
  handleTick() {
    // Add passive gold per second
    const goldPerSec = this.gameState.getGoldPerSec();
    if (goldPerSec !== 0) {
      this.gameState.addGold(goldPerSec);
    }

    // Handle auto-clicker
    const autoClickRate = this.gameState.getUpgradeMultipliers().autoClickRate;
    if (autoClickRate > 0) {
      for (let i = 0; i < autoClickRate; i++) {
        this.handleClick(true); // true = is auto click
      }
    }
  }

  /**
   * Handle enemy click - add gold per click
   * @param {boolean} isAutoClick - Whether this is from auto-clicker
   * @returns {number} Gold gained (with crit if applicable)
   */
  handleClick(isAutoClick = false) {
    let goldPerClick = this.gameState.getGoldPerClick();

    // Check for critical hit
    const critChance = this.gameState.getUpgradeMultipliers().critChance;
    const isCrit = Math.random() * 100 < critChance;

    if (isCrit) {
      const critMultiplier = this.gameState.getUpgradeMultipliers().critMultiplier;
      goldPerClick = Math.floor(goldPerClick * critMultiplier);
    }

    // Add gold
    this.gameState.addGold(goldPerClick);

    // Increment click stat
    if (!isAutoClick) {
      this.gameState.incrementClicks();
    }

    // Handle effects (if effects manager exists)
    if (this.effectsManager && !isAutoClick) {
      this.effectsManager.handleClick(goldPerClick);
    }

    // Handle boss damage (if boss manager exists)
    if (this.bossManager) {
      this.bossManager.handleClick(goldPerClick);
    }

    return goldPerClick;
  }
}
