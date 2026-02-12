/**
 * DOMCache - Cache all DOM queries for better performance
 * Query elements once at startup instead of repeatedly
 */
export class DOMCache {
  constructor() {
    this.elements = {};
    this.cacheElements();
  }

  /**
   * Cache all DOM elements
   */
  cacheElements() {
    // Main containers
    this.elements.main = document.querySelector('main');

    // Asides
    this.elements.asideShop = document.getElementById('asideShop');
    this.elements.asideInventory = document.getElementById('asideInventory');
    this.elements.asideUpgrades = document.getElementById('asideUpgrades');
    this.elements.asideAchievements = document.getElementById('asideAchievements');
    this.elements.asideStats = document.getElementById('asideStats');

    // Grid containers
    this.elements.gridContainerShop = document.querySelector('.grid-container-shop');
    this.elements.gridContainerInventory = document.querySelector('.grid-container-inventory');
    this.elements.gridContainerRandomChestLoots = document.querySelector('.grid-container-randomChestLoots');

    // New containers
    this.elements.upgradesContainer = document.getElementById('upgradesContainer');
    this.elements.achievementsContainer = document.getElementById('achievementsContainer');
    this.elements.statsContainer = document.getElementById('statsContainer');

    // Buttons
    this.elements.shop = document.getElementById('shop');
    this.elements.inventory = document.getElementById('inventory');
    this.elements.upgrades = document.getElementById('upgrades');
    this.elements.achievements = document.getElementById('achievements');
    this.elements.stats = document.getElementById('stats');
    this.elements.reset = document.getElementById('reset');

    // Gold display
    this.elements.goldContainer = document.getElementById('gold-container');
    this.elements.currentGold = document.getElementById('currentGold');
    this.elements.goldPerClickSpan = document.getElementById('goldPerClickSpan');
    this.elements.goldPerSecSpan = document.getElementById('goldPerSecSpan');

    // Progress bar
    this.elements.progressWrapper = document.getElementById('progress-wrapper');
    this.elements.progressContainer = document.getElementById('progress-container');
    this.elements.progressBar = document.getElementById('progress-bar');
    this.elements.progressText = document.getElementById('progress-text');

    // Characters
    this.elements.basicKnight = document.getElementById('basicKnight');
    this.elements.ennemy = document.getElementById('ennemy');

    // Chest
    this.elements.chestContainer = document.getElementById('chestContainer');
    this.elements.chest = document.getElementById('chest');

    // Messages
    this.elements.message = document.getElementById('message');
    this.elements.winMessage = document.getElementById('win-message');

    // Parallax layers
    this.elements.layer1 = document.getElementById('layer-1');
    this.elements.layer2 = document.getElementById('layer-2');
    this.elements.layer3 = document.getElementById('layer-3');
    this.elements.parallaxLayers = document.querySelectorAll('.parallax-layer');
  }

  /**
   * Get a cached DOM element
   * @param {string} name - Element name
   * @returns {HTMLElement|null}
   */
  get(name) {
    if (!this.elements[name]) {
      console.warn(`Element "${name}" not found in DOM cache`);
      return null;
    }
    return this.elements[name];
  }

  /**
   * Check if an element exists
   * @param {string} name - Element name
   * @returns {boolean}
   */
  has(name) {
    return !!this.elements[name];
  }

  /**
   * Add a new element to cache
   * @param {string} name - Element name
   * @param {HTMLElement} element - DOM element
   */
  add(name, element) {
    this.elements[name] = element;
  }

  /**
   * Remove an element from cache
   * @param {string} name - Element name
   */
  remove(name) {
    delete this.elements[name];
  }
}
