/**
 * ChestManager - Handles chest spawn and bonus item logic
 * Manages random chest appearances and rewards
 */
export class ChestManager {
  constructor(gameState, eventBus, domCache, animationLoop) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;
    this.chestOpened = false;

    // Start chest spawn timer
    this.startChestSpawnTimer();

    // Setup chest click handler
    this.setupChestClickHandler();
  }

  /**
   * Start timer for chest spawning
   * Chest appears every 10 seconds initially, then disappears after 3 seconds
   */
  startChestSpawnTimer() {
    // Initial hide
    this.hideChest();

    // Show chest after 13 seconds (10s initial + 3s offset)
    setTimeout(() => {
      this.showChest();
    }, 13000);

    // Repeat every 10 seconds after initial appearance
    setInterval(() => {
      setTimeout(() => {
        if (!this.chestOpened) {
          this.showChest();
        }
      }, 3000);
    }, 10000);
  }

  /**
   * Show chest
   */
  showChest() {
    const chest = this.domCache.get('chest');
    if (chest) {
      chest.style.display = 'block';
      chest.src = './assets/miscs/chest.png';
    }
  }

  /**
   * Hide chest
   */
  hideChest() {
    const chest = this.domCache.get('chest');
    if (chest) {
      chest.style.display = 'none';
      chest.src = './assets/miscs/chest.png';
    }
  }

  /**
   * Setup chest click handler
   */
  setupChestClickHandler() {
    const chest = this.domCache.get('chest');
    if (!chest) return;

    chest.addEventListener('click', () => this.openChest());
  }

  /**
   * Open chest and give random bonus item
   */
  openChest() {
    if (this.chestOpened) return;

    this.chestOpened = true;
    const chest = this.domCache.get('chest');

    // Change to opening animation
    if (chest) {
      chest.src = './assets/miscs/chestGif.gif';
    }

    // Get random item
    const randomItem = this.getRandomItem();

    if (randomItem) {
      // Add bonus item to game state
      this.gameState.addBonusItem(randomItem);

      // Increment chests opened stat
      this.gameState.incrementChestsOpened();

      // Show item animation
      this.showItemAnimation(randomItem);
    }

    // Hide chest after animation
    setTimeout(() => {
      this.hideChest();
      this.chestOpened = false;
    }, 4500);
  }

  /**
   * Get random bonus item
   * @returns {Object|null} Random bonus item
   */
  getRandomItem() {
    const bonusData = this.gameState.getBonusItemsData();
    if (!bonusData) {
      console.error('Bonus data not loaded');
      return null;
    }

    const currentBonus = this.gameState.getBonusItems();
    const keys = Object.keys(bonusData);

    // Filter out already obtained items
    const availableKeys = keys.filter(key => {
      return !currentBonus.some(item => item.src === bonusData[key].src);
    });

    // Reset if all items collected
    if (availableKeys.length === 0) {
      this.gameState.clearBonusItems();
      // Return a random item after reset
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      return bonusData[randomKey];
    }

    // Return random available item
    const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    return bonusData[randomKey];
  }

  /**
   * Show item animation (floating item)
   * @param {Object} item - Item to show
   */
  showItemAnimation(item) {
    const chestContainer = this.domCache.get('chestContainer');
    if (!chestContainer) return;

    const itemImage = document.createElement('img');
    itemImage.classList.add('randomItem');
    itemImage.classList.add('animate-slide-up-down');
    itemImage.src = item.src;
    itemImage.alt = 'Random Item';

    chestContainer.appendChild(itemImage);

    // Change to exit animation after 3 seconds
    setTimeout(() => {
      itemImage.classList.remove('animate-slide-up-down');
      itemImage.classList.add('animate-goOutOfScreen');
    }, 3000);

    // Remove element after animation
    setTimeout(() => {
      if (chestContainer.contains(itemImage)) {
        chestContainer.removeChild(itemImage);
      }
    }, 4500);
  }
}
