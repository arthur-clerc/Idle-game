/**
 * GoldUI - Handles all gold display updates
 * Reacts to state changes via EventBus
 */
export class GoldUI {
  constructor(gameState, eventBus, domCache) {
    this.gameState = gameState;
    this.domCache = domCache;

    // Listen for state changes
    eventBus.on('gold:changed', (gold) => this.updateCurrentGold(gold.current));
    eventBus.on('gold:perClick:changed', (value) => this.updateGoldPerClick(value));
    eventBus.on('gold:perSec:changed', (value) => this.updateGoldPerSec(value));

    // Initial render
    this.render();
  }

  /**
   * Initial render of all gold displays
   */
  render() {
    this.updateCurrentGold(this.gameState.getGold());
    this.updateGoldPerClick(this.gameState.getGoldPerClick());
    this.updateGoldPerSec(this.gameState.getGoldPerSec());
  }

  /**
   * Update current gold display
   * @param {number} value - Current gold amount
   */
  updateCurrentGold(value) {
    const element = this.domCache.get('currentGold');
    if (element) {
      element.textContent = `Current Gold: ${value.toLocaleString()}`;
    }
  }

  /**
   * Update gold per click display
   * @param {number} value - Gold per click amount
   */
  updateGoldPerClick(value) {
    const element = this.domCache.get('goldPerClickSpan');
    if (element) {
      element.textContent = `Gold/Clic: ${value.toLocaleString()}`;
    }
  }

  /**
   * Update gold per second display
   * @param {number} value - Gold per second amount
   */
  updateGoldPerSec(value) {
    const element = this.domCache.get('goldPerSecSpan');
    if (element) {
      element.textContent = `Gold/Sec: ${value.toLocaleString()}`;
    }
  }
}
