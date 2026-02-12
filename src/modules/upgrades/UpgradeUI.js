/**
 * UpgradeUI - Handles upgrade panel display
 * Shows available upgrades and handles purchases
 */
export class UpgradeUI {
  constructor(gameState, eventBus, domCache, upgradeManager) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;
    this.upgradeManager = upgradeManager;

    // Listen for events
    eventBus.on('upgrade:purchased', () => this.render());
    eventBus.on('gold:changed', () => this.updateAffordability());

    // Initial render after data loaded
    eventBus.on('state:loaded', () => this.render());
  }

  /**
   * Initialize upgrade panel
   */
  initialize() {
    this.render();
  }

  /**
   * Render all upgrades
   */
  render() {
    const upgradesContainer = this.domCache.get('upgradesContainer');
    if (!upgradesContainer) return;

    upgradesContainer.innerHTML = '';

    const allUpgrades = this.upgradeManager.getAllUpgrades();

    // Group by category
    const categories = {
      goldPerClick: { title: 'GOLD PER CLICK', upgrades: [] },
      goldPerSec: { title: 'GOLD PER SECOND', upgrades: [] },
      special: { title: 'SPECIAL UPGRADES', upgrades: [] }
    };

    allUpgrades.forEach(upgrade => {
      if (categories[upgrade.category]) {
        categories[upgrade.category].upgrades.push(upgrade);
      }
    });

    // Render each category
    for (const categoryKey in categories) {
      const category = categories[categoryKey];
      if (category.upgrades.length > 0) {
        const categoryElement = this.createCategoryElement(category);
        upgradesContainer.appendChild(categoryElement);
      }
    }
  }

  /**
   * Create category element
   * @param {Object} category - Category data
   * @returns {HTMLElement}
   */
  createCategoryElement(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'upgrade-category';

    const title = document.createElement('h3');
    title.className = 'upgrade-category-title';
    title.textContent = category.title;
    categoryDiv.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'upgrade-grid';

    category.upgrades.forEach(upgrade => {
      const upgradeElement = this.createUpgradeElement(upgrade);
      grid.appendChild(upgradeElement);
    });

    categoryDiv.appendChild(grid);
    return categoryDiv;
  }

  /**
   * Create upgrade element
   * @param {Object} upgrade - Upgrade data
   * @returns {HTMLElement}
   */
  createUpgradeElement(upgrade) {
    const canAfford = this.gameState.getGold() >= upgrade.nextPrice;

    const upgradeDiv = document.createElement('div');
    upgradeDiv.className = `upgrade-item ${canAfford ? 'affordable' : 'unaffordable'}`;
    upgradeDiv.dataset.upgradeId = upgrade.id;

    upgradeDiv.innerHTML = `
      <div class="upgrade-icon">${upgrade.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-level">Level: ${upgrade.currentLevel}</div>
        <div class="upgrade-description">${upgrade.description}</div>
        <div class="upgrade-price">
          <span class="price-value">${upgrade.nextPrice.toLocaleString()}</span>
          <span class="gold-icon">💰</span>
        </div>
      </div>
    `;

    upgradeDiv.addEventListener('click', () => {
      this.handleUpgradePurchase(upgrade.id);
    });

    return upgradeDiv;
  }

  /**
   * Handle upgrade purchase
   * @param {string} upgradeId - Upgrade ID
   */
  handleUpgradePurchase(upgradeId) {
    const success = this.upgradeManager.purchaseUpgrade(upgradeId);

    if (success) {
      // Show purchase feedback
      this.showPurchaseFeedback(upgradeId);
    } else {
      // Show error feedback
      this.showErrorFeedback();
    }
  }

  /**
   * Update affordability styling
   */
  updateAffordability() {
    const currentGold = this.gameState.getGold();
    const upgradeItems = document.querySelectorAll('.upgrade-item');

    upgradeItems.forEach(item => {
      const upgradeId = item.dataset.upgradeId;
      const upgrade = this.upgradeManager.getAllUpgrades().find(u => u.id === upgradeId);

      if (upgrade) {
        const canAfford = currentGold >= upgrade.nextPrice;
        item.classList.toggle('affordable', canAfford);
        item.classList.toggle('unaffordable', !canAfford);
      }
    });
  }

  /**
   * Show purchase feedback
   * @param {string} upgradeId - Upgrade ID
   */
  showPurchaseFeedback(upgradeId) {
    const item = document.querySelector(`[data-upgrade-id="${upgradeId}"]`);
    if (!item) return;

    item.classList.add('purchased-flash');
    setTimeout(() => {
      item.classList.remove('purchased-flash');
    }, 300);
  }

  /**
   * Show error feedback
   */
  showErrorFeedback() {
    // Could add screen shake or sound effect
    console.log('Cannot purchase upgrade');
  }
}
