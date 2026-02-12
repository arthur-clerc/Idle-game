/**
 * UpgradeManager - Handles upgrade purchases and effects
 * Manages multiplicative and additive upgrades
 */
export class UpgradeManager {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;
  }

  /**
   * Purchase an upgrade
   * @param {string} upgradeId - Upgrade ID
   * @returns {boolean} Success status
   */
  purchaseUpgrade(upgradeId) {
    const upgradesData = this.gameState.getUpgradesData();
    if (!upgradesData) {
      console.error('Upgrades data not loaded');
      return false;
    }

    // Find upgrade
    const upgrade = this.findUpgradeById(upgradesData, upgradeId);
    if (!upgrade) {
      console.error('Upgrade not found:', upgradeId);
      return false;
    }

    // Calculate price based on current level
    const currentLevel = this.gameState.getUpgradeLevel(upgradeId);
    const price = this.calculatePrice(upgrade, currentLevel);

    // Check if can afford
    if (this.gameState.getGold() < price) {
      console.log('Cannot afford upgrade:', upgradeId, 'Price:', price);
      return false;
    }

    // Purchase
    const success = this.gameState.purchaseUpgrade(upgradeId, upgrade);

    if (success) {
      console.log('Upgrade purchased:', upgradeId, 'New level:', currentLevel + 1);
    }

    return success;
  }

  /**
   * Find upgrade by ID in all categories
   * @param {Object} upgradesData - All upgrades data
   * @param {string} upgradeId - Upgrade ID
   * @returns {Object|null}
   */
  findUpgradeById(upgradesData, upgradeId) {
    for (const category in upgradesData) {
      const upgrades = upgradesData[category];
      const upgrade = upgrades.find(u => u.id === upgradeId);
      if (upgrade) return upgrade;
    }
    return null;
  }

  /**
   * Calculate upgrade price
   * @param {Object} upgrade - Upgrade data
   * @param {number} currentLevel - Current upgrade level
   * @returns {number}
   */
  calculatePrice(upgrade, currentLevel) {
    return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel));
  }

  /**
   * Get all available upgrades with their prices
   * @returns {Array}
   */
  getAllUpgrades() {
    const upgradesData = this.gameState.getUpgradesData();
    if (!upgradesData) return [];

    const allUpgrades = [];

    for (const category in upgradesData) {
      const upgrades = upgradesData[category];
      upgrades.forEach(upgrade => {
        const level = this.gameState.getUpgradeLevel(upgrade.id);
        const price = this.calculatePrice(upgrade, level);

        allUpgrades.push({
          ...upgrade,
          currentLevel: level,
          nextPrice: price,
          category: category
        });
      });
    }

    return allUpgrades;
  }
}
