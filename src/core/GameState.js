/**
 * GameState - Central state management (singleton pattern)
 * Single source of truth for all game data
 * Emits events on state changes for reactive UI updates
 */
export class GameState {
  #state = {
    gold: {
      current: 0,
      perClick: 100,
      perSec: 0,
      basePerClick: 100,
      basePerSec: 0
    },
    inventory: {
      boughtItems: {},
      bonusItems: []
    },
    progress: {
      current: 0,
      max: 1000000
    },
    armorSet: null,
    upgrades: {
      owned: {},
      multipliers: {
        goldPerClick: 1,
        goldPerSec: 1,
        critChance: 0,
        critMultiplier: 3,
        autoClickRate: 0
      }
    },
    achievements: {
      unlocked: {},
      multiplier: 1
    },
    stats: {
      totalClicks: 0,
      totalGoldEarned: 0,
      itemsPurchased: 0,
      upgradesPurchased: 0,
      chestsOpened: 0,
      bossesDefeated: 0,
      timePlayed: 0,
      gameStartTime: Date.now(),
      lastSaveTime: Date.now()
    },
    prestige: {
      level: 0,
      points: 0,
      totalRuns: 0
    },
    boss: {
      active: false,
      hp: 0,
      maxHp: 0,
      reward: 0,
      clicksUntilNext: 100
    },
    ui: {
      activePanel: null
    },
    data: {
      armorSets: null,
      bonusItems: null,
      upgrades: null,
      achievements: null
    }
  };

  constructor(eventBus, storageManager) {
    this.eventBus = eventBus;
    this.storage = storageManager;
  }

  // ============ GOLD METHODS ============

  /**
   * Get current gold amount
   * @returns {number}
   */
  getGold() {
    return this.#state.gold.current;
  }

  /**
   * Get gold per click
   * @returns {number}
   */
  getGoldPerClick() {
    return this.#state.gold.perClick;
  }

  /**
   * Get gold per second
   * @returns {number}
   */
  getGoldPerSec() {
    return this.#state.gold.perSec;
  }

  /**
   * Add gold (can be negative to subtract)
   * @param {number} amount - Amount to add
   */
  addGold(amount) {
    this.#state.gold.current += amount;
    this.addToTotalGoldEarned(amount);
    this.eventBus.emit('gold:changed', { ...this.#state.gold });
    this.save();
  }

  /**
   * Set gold per click
   * @param {number} value - New gold per click value
   */
  setGoldPerClick(value) {
    this.#state.gold.perClick = value;
    this.eventBus.emit('gold:perClick:changed', value);
    this.save();
  }

  /**
   * Set gold per second
   * @param {number} value - New gold per second value
   */
  setGoldPerSec(value) {
    this.#state.gold.perSec = value;
    this.eventBus.emit('gold:perSec:changed', value);
    this.save();
  }

  // ============ INVENTORY METHODS ============

  /**
   * Get all bought items
   * @returns {Object} Copy of bought items
   */
  getInventory() {
    return { ...this.#state.inventory.boughtItems };
  }

  /**
   * Get all bonus items from chests
   * @returns {Array} Copy of bonus items
   */
  getBonusItems() {
    return [...this.#state.inventory.bonusItems];
  }

  /**
   * Check if an item is owned
   * @param {number|string} itemId - Item ID
   * @returns {boolean}
   */
  hasItem(itemId) {
    return !!this.#state.inventory.boughtItems[itemId];
  }

  /**
   * Add an item to inventory (purchase)
   * @param {number|string} itemId - Item ID
   * @param {Object} itemData - Item data (src, price, goldPerSec, etc.)
   * @returns {boolean} Success status
   */
  addItem(itemId, itemData) {
    // Check if already owned
    if (this.#state.inventory.boughtItems[itemId]) {
      console.log('Item already owned:', itemId);
      return false;
    }

    // Check if can afford
    if (itemData.price > this.#state.gold.current) {
      console.log('Cannot afford item:', itemId);
      return false;
    }

    // Add to inventory
    this.#state.inventory.boughtItems[itemId] = {
      src: itemData.src,
      price: itemData.price,
      buyReward: itemData.buyReward,
      goldPerSec: itemData.goldPerSec || 0
    };

    // Deduct gold
    this.addGold(-itemData.price);

    // Recalculate gold per sec
    this.recalculateGoldPerSec();

    // Check for armor set completion
    this.checkArmorSetCompletion();

    // Update stats
    this.incrementItemsPurchased();

    // Emit event
    this.eventBus.emit('inventory:itemAdded', { itemId, itemData });

    this.save();
    return true;
  }

  /**
   * Add a bonus item from chest
   * @param {Object} bonusData - Bonus item data
   */
  addBonusItem(bonusData) {
    // Check if already exists
    const exists = this.#state.inventory.bonusItems.some(
      item => item.src === bonusData.src
    );

    if (exists) {
      console.log('Bonus item already owned:', bonusData.id);
      return false;
    }

    this.#state.inventory.bonusItems.push(bonusData);
    this.recalculateGoldPerSec();
    this.eventBus.emit('inventory:bonusAdded', bonusData);
    this.save();
    return true;
  }

  /**
   * Remove all bonus items (when all collected)
   */
  clearBonusItems() {
    this.#state.inventory.bonusItems = [];
    this.recalculateGoldPerSec();
    this.save();
  }

  /**
   * Recalculate total gold per second from all items
   * @deprecated Use recalculateGoldValues instead
   */
  recalculateGoldPerSec() {
    this.recalculateGoldValues();
  }

  // ============ PROGRESS METHODS ============

  /**
   * Get current progress
   * @returns {number}
   */
  getProgress() {
    return this.#state.progress.current;
  }

  /**
   * Get max progress
   * @returns {number}
   */
  getMaxProgress() {
    return this.#state.progress.max;
  }

  /**
   * Add progress
   * @param {number} amount - Amount to add
   */
  addProgress(amount) {
    this.#state.progress.current = Math.min(
      this.#state.progress.current + amount,
      this.#state.progress.max
    );

    this.eventBus.emit('progress:changed', { ...this.#state.progress });

    // Check win condition
    if (this.#state.progress.current >= this.#state.progress.max) {
      this.eventBus.emit('game:won');
    }

    this.save();
  }

  // ============ ARMOR SET METHODS ============

  /**
   * Get current armor set name
   * @returns {string|null}
   */
  getArmorSet() {
    return this.#state.armorSet;
  }

  /**
   * Check if all pieces of an armor set are owned
   * Checks in reverse order to prioritize best armor set
   */
  checkArmorSetCompletion() {
    const armorSets = {
      iron: [0, 1, 2, 3],
      gold: [4, 5, 6, 7],
      diamond: [8, 9, 10, 11],
      nezerit: [12, 13, 14, 15]
    };

    // Check in reverse order (best to worst) to prioritize best set
    const setOrder = ['nezerit', 'diamond', 'gold', 'iron'];

    for (const setName of setOrder) {
      const setIds = armorSets[setName];
      const hasAllPieces = setIds.every(id => this.hasItem(id));

      if (hasAllPieces) {
        // Update only if it's different from current set
        if (this.#state.armorSet !== setName) {
          this.setArmorSet(setName);
        }
        break; // Found the best complete set, stop checking
      }
    }
  }

  /**
   * Set the current armor set
   * @param {string} setName - Armor set name (iron, gold, diamond, nezerit)
   */
  setArmorSet(setName) {
    this.#state.armorSet = setName;
    this.updateGoldPerClickFromSet(setName);
    this.eventBus.emit('armorSet:changed', setName);
    this.save();
  }

  /**
   * Update gold per click based on armor set
   * @param {string} setName - Armor set name
   */
  updateGoldPerClickFromSet(setName) {
    // Just recalculate all values with current armor set
    this.recalculateGoldValues();
  }

  // ============ UI STATE METHODS ============

  /**
   * Get active panel
   * @returns {string|null} 'shop', 'inventory', or null
   */
  getActivePanel() {
    return this.#state.ui.activePanel;
  }

  /**
   * Set active panel
   * @param {string|null} panel - Panel name or null
   */
  setActivePanel(panel) {
    this.#state.ui.activePanel = panel;
    this.eventBus.emit('ui:panelChanged', panel);
  }

  // ============ DATA METHODS ============

  /**
   * Set loaded armor sets data
   * @param {Object} data - Armor sets data from JSON
   */
  setArmorSetsData(data) {
    this.#state.data.armorSets = data;
  }

  /**
   * Get armor sets data
   * @returns {Object}
   */
  getArmorSetsData() {
    return this.#state.data.armorSets;
  }

  /**
   * Set loaded bonus items data
   * @param {Object} data - Bonus items data from JSON
   */
  setBonusItemsData(data) {
    this.#state.data.bonusItems = data;
  }

  /**
   * Get bonus items data
   * @returns {Object}
   */
  getBonusItemsData() {
    return this.#state.data.bonusItems;
  }

  /**
   * Set upgrades data
   * @param {Object} data - Upgrades data from JSON
   */
  setUpgradesData(data) {
    this.#state.data.upgrades = data;
  }

  /**
   * Get upgrades data
   * @returns {Object}
   */
  getUpgradesData() {
    return this.#state.data.upgrades;
  }

  /**
   * Set achievements data
   * @param {Object} data - Achievements data from JSON
   */
  setAchievementsData(data) {
    this.#state.data.achievements = data;
  }

  /**
   * Get achievements data
   * @returns {Object}
   */
  getAchievementsData() {
    return this.#state.data.achievements;
  }

  // ============ UPGRADE METHODS ============

  /**
   * Purchase an upgrade
   * @param {string} upgradeId - Upgrade ID
   * @param {Object} upgradeData - Upgrade data
   * @returns {boolean} Success status
   */
  purchaseUpgrade(upgradeId, upgradeData) {
    const currentLevel = this.#state.upgrades.owned[upgradeId] || 0;
    const price = Math.floor(upgradeData.basePrice * Math.pow(upgradeData.priceMultiplier, currentLevel));

    if (this.#state.gold.current < price) {
      return false;
    }

    this.addGold(-price);
    this.#state.upgrades.owned[upgradeId] = currentLevel + 1;
    this.#state.stats.upgradesPurchased++;

    this.applyUpgradeEffect(upgradeData);
    this.eventBus.emit('upgrade:purchased', { upgradeId, level: currentLevel + 1 });
    this.save();
    return true;
  }

  /**
   * Apply upgrade effect
   * @param {Object} upgradeData - Upgrade data
   */
  applyUpgradeEffect(upgradeData) {
    switch(upgradeData.effectType) {
      case 'multiply':
        if (upgradeData.id.startsWith('gpc')) {
          this.#state.upgrades.multipliers.goldPerClick *= upgradeData.effect;
        } else if (upgradeData.id.startsWith('gps')) {
          this.#state.upgrades.multipliers.goldPerSec *= upgradeData.effect;
        }
        break;
      case 'add':
        if (upgradeData.id.startsWith('gps')) {
          this.#state.gold.basePerSec += upgradeData.effect;
        }
        break;
      case 'autoclick':
        this.#state.upgrades.multipliers.autoClickRate = upgradeData.effect;
        break;
      case 'critchance':
        this.#state.upgrades.multipliers.critChance = upgradeData.effect;
        break;
      case 'luckboost':
        // Will be handled by chest manager
        break;
    }
    this.recalculateGoldValues();
  }

  /**
   * Recalculate gold per click and per sec with all multipliers
   */
  recalculateGoldValues() {
    // Base values from armor sets
    const armorBonuses = {
      'iron': 300,
      'gold': 500,
      'diamond': 900,
      'nezerit': 1700
    };
    const baseFromArmor = armorBonuses[this.#state.armorSet] || 100;

    // Calculate gold per click
    const gpcMultiplier = this.#state.upgrades.multipliers.goldPerClick * this.#state.achievements.multiplier;
    this.#state.gold.perClick = Math.floor(baseFromArmor * gpcMultiplier);

    // Calculate gold per sec
    const itemsGold = Object.values(this.#state.inventory.boughtItems)
      .reduce((sum, item) => sum + (item.goldPerSec || 0), 0);
    const bonusGold = this.#state.inventory.bonusItems
      .reduce((sum, item) => sum + (item.goldPerSec || 0), 0);

    const totalBase = this.#state.gold.basePerSec + itemsGold + bonusGold;
    const gpsMultiplier = this.#state.upgrades.multipliers.goldPerSec * this.#state.achievements.multiplier;
    this.#state.gold.perSec = Math.floor(totalBase * gpsMultiplier);

    this.eventBus.emit('gold:perClick:changed', this.#state.gold.perClick);
    this.eventBus.emit('gold:perSec:changed', this.#state.gold.perSec);
  }

  /**
   * Get upgrade level
   * @param {string} upgradeId - Upgrade ID
   * @returns {number}
   */
  getUpgradeLevel(upgradeId) {
    return this.#state.upgrades.owned[upgradeId] || 0;
  }

  /**
   * Get all upgrade multipliers
   * @returns {Object}
   */
  getUpgradeMultipliers() {
    return { ...this.#state.upgrades.multipliers };
  }

  // ============ ACHIEVEMENT METHODS ============

  /**
   * Unlock an achievement
   * @param {string} achievementId - Achievement ID
   * @param {Object} reward - Reward data
   */
  unlockAchievement(achievementId, reward) {
    if (this.#state.achievements.unlocked[achievementId]) {
      return false;
    }

    this.#state.achievements.unlocked[achievementId] = Date.now();

    // Apply reward
    if (reward.type === 'gold') {
      this.addGold(reward.value);
    } else if (reward.type === 'multiplier') {
      this.#state.achievements.multiplier *= reward.value;
      this.recalculateGoldValues();
    }

    this.eventBus.emit('achievement:unlocked', achievementId);
    this.save();
    return true;
  }

  /**
   * Check if achievement is unlocked
   * @param {string} achievementId - Achievement ID
   * @returns {boolean}
   */
  isAchievementUnlocked(achievementId) {
    return !!this.#state.achievements.unlocked[achievementId];
  }

  /**
   * Get all unlocked achievements
   * @returns {Object}
   */
  getUnlockedAchievements() {
    return { ...this.#state.achievements.unlocked };
  }

  // ============ STATS METHODS ============

  /**
   * Increment clicks stat
   */
  incrementClicks() {
    this.#state.stats.totalClicks++;
  }

  /**
   * Add to total gold earned
   * @param {number} amount - Amount earned
   */
  addToTotalGoldEarned(amount) {
    if (amount > 0) {
      this.#state.stats.totalGoldEarned += amount;
    }
  }

  /**
   * Increment items purchased
   */
  incrementItemsPurchased() {
    this.#state.stats.itemsPurchased++;
  }

  /**
   * Increment chests opened
   */
  incrementChestsOpened() {
    this.#state.stats.chestsOpened++;
  }

  /**
   * Increment bosses defeated
   */
  incrementBossesDefeated() {
    this.#state.stats.bossesDefeated++;
  }

  /**
   * Update time played
   */
  updateTimePlayed() {
    const now = Date.now();
    const elapsed = Math.floor((now - this.#state.stats.lastSaveTime) / 1000);
    this.#state.stats.timePlayed += elapsed;
    this.#state.stats.lastSaveTime = now;
  }

  /**
   * Get all stats
   * @returns {Object}
   */
  getStats() {
    return { ...this.#state.stats };
  }

  // ============ BOSS METHODS ============

  /**
   * Spawn a boss
   */
  spawnBoss() {
    const level = Math.floor(this.#state.stats.totalClicks / 100) + 1;
    const maxHp = 100 * level;
    const reward = 1000 * level;

    this.#state.boss = {
      active: true,
      hp: maxHp,
      maxHp: maxHp,
      reward: reward,
      clicksUntilNext: 100
    };

    this.eventBus.emit('boss:spawned', this.#state.boss);
  }

  /**
   * Damage boss
   * @param {number} damage - Damage amount
   * @returns {boolean} Boss defeated
   */
  damageBoss(damage) {
    if (!this.#state.boss.active) return false;

    this.#state.boss.hp -= damage;

    if (this.#state.boss.hp <= 0) {
      this.defeatBoss();
      return true;
    }

    this.eventBus.emit('boss:damaged', this.#state.boss);
    return false;
  }

  /**
   * Defeat the boss
   */
  defeatBoss() {
    const reward = this.#state.boss.reward;
    this.addGold(reward);
    this.incrementBossesDefeated();

    this.#state.boss.active = false;
    this.eventBus.emit('boss:defeated', reward);
    this.save();
  }

  /**
   * Get boss state
   * @returns {Object}
   */
  getBossState() {
    return { ...this.#state.boss };
  }

  /**
   * Decrement clicks until next boss
   */
  decrementBossCounter() {
    if (this.#state.boss.clicksUntilNext > 0) {
      this.#state.boss.clicksUntilNext--;
      if (this.#state.boss.clicksUntilNext === 0 && !this.#state.boss.active) {
        this.spawnBoss();
        this.#state.boss.clicksUntilNext = 100;
      }
    }
  }

  // ============ PRESTIGE METHODS ============

  /**
   * Get prestige data
   * @returns {Object}
   */
  getPrestigeData() {
    return { ...this.#state.prestige };
  }

  /**
   * Calculate prestige points available
   * @returns {number}
   */
  calculatePrestigePoints() {
    const progressPercent = this.#state.progress.current / this.#state.progress.max;
    return Math.floor(progressPercent * 10);
  }

  /**
   * Perform prestige reset
   */
  performPrestige() {
    const points = this.calculatePrestigePoints();

    if (points === 0) return false;

    this.#state.prestige.points += points;
    this.#state.prestige.level++;
    this.#state.prestige.totalRuns++;

    // Reset game state but keep prestige
    const prestigeData = { ...this.#state.prestige };
    const achievementsData = { ...this.#state.achievements };

    this.#state.gold = { current: 0, perClick: 100, perSec: 0, basePerClick: 100, basePerSec: 0 };
    this.#state.inventory = { boughtItems: {}, bonusItems: [] };
    this.#state.progress = { current: 0, max: 1000000 };
    this.#state.armorSet = null;
    this.#state.upgrades = {
      owned: {},
      multipliers: {
        goldPerClick: 1 + (prestigeData.points * 0.1),
        goldPerSec: 1 + (prestigeData.points * 0.1),
        critChance: 0,
        critMultiplier: 3,
        autoClickRate: 0
      }
    };
    this.#state.boss = {
      active: false,
      hp: 0,
      maxHp: 0,
      reward: 0,
      clicksUntilNext: 100
    };

    this.#state.prestige = prestigeData;
    this.#state.achievements = achievementsData;

    this.eventBus.emit('prestige:performed', points);
    this.save();
    location.reload();
    return true;
  }

  // ============ PERSISTENCE METHODS ============

  /**
   * Load game state from localStorage
   * Maintains backward compatibility with old save format
   */
  load() {
    // Load saved values
    const savedGold = this.storage.getNumber('currentGold', 0);
    const savedProgress = this.storage.getNumber('progress', 0);
    const savedItems = this.storage.getJSON('boughtItems', {});
    const savedBonus = this.storage.getJSON('BonusLoot', []);
    const savedArmorSet = this.storage.getJSON('armorSet', null);

    // Restore state
    this.#state.gold.current = savedGold;
    this.#state.progress.current = savedProgress;
    this.#state.inventory.boughtItems = savedItems;
    this.#state.inventory.bonusItems = savedBonus;
    this.#state.armorSet = savedArmorSet?.name || null;

    // Recalculate derived values
    this.recalculateGoldPerSec();

    if (this.#state.armorSet) {
      this.updateGoldPerClickFromSet(this.#state.armorSet);
    }

    // Emit loaded event
    this.eventBus.emit('state:loaded');

    console.log('Game state loaded:', {
      gold: this.#state.gold.current,
      progress: this.#state.progress.current,
      items: Object.keys(this.#state.inventory.boughtItems).length,
      armorSet: this.#state.armorSet
    });
  }

  /**
   * Save game state to localStorage
   * Maintains backward compatibility with old save format
   */
  save() {
    // Save in old format for compatibility
    this.storage.setNumber('currentGold', this.#state.gold.current);
    this.storage.setNumber('progress', this.#state.progress.current);
    this.storage.setJSON('boughtItems', this.#state.inventory.boughtItems);
    this.storage.setJSON('BonusLoot', this.#state.inventory.bonusItems);

    if (this.#state.armorSet) {
      this.storage.setJSON('armorSet', {
        name: this.#state.armorSet,
        pieces: Object.values(this.#state.inventory.boughtItems).filter((_, i) => i < 4)
      });
    }

    this.storage.setNumber('goldPerClick', this.#state.gold.perClick);
    this.storage.setNumber('goldPerSec', this.#state.gold.perSec);
  }

  /**
   * Reset game state
   */
  reset() {
    this.storage.clear();
    this.#state = {
      gold: { current: 0, perClick: 100, perSec: 0 },
      inventory: { boughtItems: {}, bonusItems: [] },
      progress: { current: 0, max: 1000000 },
      armorSet: null,
      ui: { activePanel: null },
      data: { armorSets: this.#state.data.armorSets, bonusItems: this.#state.data.bonusItems }
    };
    this.eventBus.emit('state:reset');
    location.reload();
  }
}
