/**
 * InventoryUI - Handles shop and inventory display
 * Uses event delegation for better performance
 */
export class InventoryUI {
  constructor(gameState, eventBus, domCache, inventoryManager) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;
    this.inventoryManager = inventoryManager;

    // Listen for inventory changes
    eventBus.on('inventory:itemAdded', () => {
      this.updateShopDisplay();
      this.displayInventory();
      this.displayBonusItems();
    });

    eventBus.on('inventory:bonusAdded', () => {
      this.displayBonusItems();
    });

    // Setup event delegation for shop items
    this.setupShopClickHandler();
  }

  /**
   * Initialize shop display with all items
   */
  initializeShop() {
    const armorSets = this.gameState.getArmorSetsData();
    if (!armorSets) {
      console.error('Cannot initialize shop: armor data not loaded');
      return;
    }

    const gridContainerShop = this.domCache.get('gridContainerShop');
    if (!gridContainerShop) return;

    gridContainerShop.innerHTML = '';
    let itemIdCounter = 0;

    for (const setName in armorSets) {
      const set = armorSets[setName];

      for (const pieceName in set) {
        const piece = set[pieceName];
        const itemElement = this.createShopItem(piece);
        gridContainerShop.appendChild(itemElement);
        itemIdCounter++;
      }
    }

    // Update display for already bought items
    this.updateShopDisplay();
  }

  /**
   * Create a shop item element
   * @param {Object} piece - Item data
   * @returns {HTMLElement}
   */
  createShopItem(piece) {
    const itemElement = document.createElement('div');
    itemElement.id = `grid-item${piece.id}`;
    itemElement.className = 'shopItemIcon';
    itemElement.dataset.itemId = piece.id;
    itemElement.style.backgroundSize = 'cover';
    itemElement.style.backgroundImage = `url("${piece.src}")`;
    itemElement.style.padding = '0';

    itemElement.innerHTML = `
      <div style='display:flex; justify-content:center; align-items:center;'>
        <span style='display:flex; justify-content:center; color:white;'>${piece.price}</span>
        <img class='goldPiecePng' src='assets/miscs/goldPiece.png'>
      </div>
    `;

    return itemElement;
  }

  /**
   * Setup click handler for shop using event delegation
   */
  setupShopClickHandler() {
    const gridContainerShop = this.domCache.get('gridContainerShop');
    if (!gridContainerShop) return;

    // Single event listener for all items (event delegation)
    gridContainerShop.addEventListener('click', (e) => {
      const item = e.target.closest('.shopItemIcon');
      if (!item) return;

      // Don't allow clicking bought items
      if (item.classList.contains('bought')) return;

      const itemId = parseInt(item.dataset.itemId, 10);
      const success = this.inventoryManager.purchaseItem(itemId);

      if (!success) {
        // Could add visual feedback here (shake animation, etc.)
        console.log('Purchase failed');
      }
    });
  }

  /**
   * Update shop display to show bought items
   */
  updateShopDisplay() {
    const boughtItems = this.inventoryManager.getBoughtItems();

    for (const itemId in boughtItems) {
      const itemElement = document.getElementById(`grid-item${itemId}`);
      if (itemElement && !itemElement.classList.contains('bought')) {
        itemElement.classList.add('bought');
      }
    }
  }

  /**
   * Display bought items in inventory
   */
  displayInventory() {
    const boughtItems = this.inventoryManager.getBoughtItems();
    const gridContainerInventory = this.domCache.get('gridContainerInventory');

    if (!gridContainerInventory) return;

    gridContainerInventory.innerHTML = '';
    let itemIdCounter = 1;

    for (const itemId in boughtItems) {
      const item = boughtItems[itemId];
      const inventoryItem = this.createInventoryItem(item, itemIdCounter);
      gridContainerInventory.appendChild(inventoryItem);
      itemIdCounter++;
    }
  }

  /**
   * Create an inventory item element
   * @param {Object} item - Item data
   * @param {number} counter - Item counter for ID
   * @returns {HTMLElement}
   */
  createInventoryItem(item, counter) {
    const itemElement = document.createElement('div');
    itemElement.id = `grid-inventory${counter}`;
    itemElement.className = 'shopItemIcon';
    itemElement.style.backgroundSize = 'cover';
    itemElement.style.backgroundImage = `url("${item.src}")`;
    itemElement.style.padding = '0';

    const goldPerSec = item.goldPerSec || 0;
    itemElement.innerHTML = `
      <div style='display:flex; justify-content:center; align-items:center;'>
        <span style='display:flex; justify-content:center; color:white;'>${goldPerSec} gold/s</span>
      </div>
    `;

    return itemElement;
  }

  /**
   * Display bonus items from chests
   */
  displayBonusItems() {
    const bonusItems = this.gameState.getBonusItems();
    const gridContainer = this.domCache.get('gridContainerRandomChestLoots');

    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    let itemIdCounter = 1;

    for (const bonus of bonusItems) {
      const bonusElement = this.createBonusItem(bonus, itemIdCounter);
      gridContainer.appendChild(bonusElement);
      itemIdCounter++;
    }
  }

  /**
   * Create a bonus item element
   * @param {Object} bonus - Bonus data
   * @param {number} counter - Item counter for ID
   * @returns {HTMLElement}
   */
  createBonusItem(bonus, counter) {
    const itemElement = document.createElement('div');
    itemElement.id = `grid-bonus${counter}`;
    itemElement.className = 'shopItemIcon';
    itemElement.style.backgroundSize = 'cover';
    itemElement.style.backgroundImage = `url("${bonus.src}")`;
    itemElement.style.padding = '0';

    const goldPerSec = bonus.goldPerSec || 0;
    itemElement.innerHTML = `
      <div style='display:flex; justify-content:center; align-items:center;'>
        <span style='display:flex; justify-content:center; color:white;'>${goldPerSec} gold/s</span>
      </div>
    `;

    return itemElement;
  }
}
