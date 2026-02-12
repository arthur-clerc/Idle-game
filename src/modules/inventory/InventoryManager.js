/**
 * InventoryManager - Handles item purchase and ownership logic
 * Centralized inventory state management
 */
export class InventoryManager {
  constructor(gameState, eventBus) {
    this.gameState = gameState;
    this.eventBus = eventBus;
  }

  /**
   * Purchase an item
   * @param {number|string} itemId - Item ID
   * @returns {boolean} Success status
   */
  purchaseItem(itemId) {
    // Get item data from game state
    const armorSets = this.gameState.getArmorSetsData();
    if (!armorSets) {
      console.error('Armor data not loaded');
      return false;
    }

    // Find item in armor sets
    const itemData = this.findItemById(armorSets, itemId);
    if (!itemData) {
      console.error('Item not found:', itemId);
      return false;
    }

    // Attempt purchase through GameState
    const success = this.gameState.addItem(itemId, itemData);

    if (success) {
      console.log('Item purchased:', itemId, itemData);
    }

    return success;
  }

  /**
   * Find an item by ID in armor sets data
   * @param {Object} armorSets - Armor sets data
   * @param {number|string} itemId - Item ID to find
   * @returns {Object|null} Item data or null
   */
  findItemById(armorSets, itemId) {
    const numericId = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;

    for (const setName in armorSets) {
      const set = armorSets[setName];

      for (const pieceName in set) {
        const piece = set[pieceName];

        if (piece.id === numericId) {
          return piece;
        }
      }
    }

    return null;
  }

  /**
   * Get all bought items
   * @returns {Object}
   */
  getBoughtItems() {
    return this.gameState.getInventory();
  }

  /**
   * Check if an item is bought
   * @param {number|string} itemId - Item ID
   * @returns {boolean}
   */
  isItemBought(itemId) {
    return this.gameState.hasItem(itemId);
  }
}
