/**
 * main.js - Application entry point (ENHANCED VERSION)
 * Bootstraps all modules and initializes the game
 */

// Core
import { EventBus } from './core/EventBus.js';
import { StorageManager } from './core/StorageManager.js';
import { GameState } from './core/GameState.js';

// Utils
import { DOMCache } from './utils/DOMCache.js';
import { AnimationLoop } from './utils/AnimationLoop.js';
import { DataLoader } from './utils/DataLoader.js';
import { OfflineProgress } from './utils/OfflineProgress.js';

// Modules
import { GoldManager } from './modules/gold/GoldManager.js';
import { GoldUI } from './modules/gold/GoldUI.js';
import { InventoryManager } from './modules/inventory/InventoryManager.js';
import { InventoryUI } from './modules/inventory/InventoryUI.js';
import { ProgressManager } from './modules/progress/ProgressManager.js';
import { ProgressUI } from './modules/progress/ProgressUI.js';
import { CharacterManager } from './modules/character/CharacterManager.js';
import { ChestManager } from './modules/chest/ChestManager.js';
import { ParallaxController } from './modules/parallax/ParallaxController.js';
import { UpgradeManager } from './modules/upgrades/UpgradeManager.js';
import { UpgradeUI } from './modules/upgrades/UpgradeUI.js';
import { AchievementManager } from './modules/achievements/AchievementManager.js';
import { AchievementUI } from './modules/achievements/AchievementUI.js';
import { StatsManager } from './modules/stats/StatsManager.js';
import { BossManager } from './modules/boss/BossManager.js';
import { EffectsManager } from './modules/effects/EffectsManager.js';

// UI
import { PanelManager } from './ui/PanelManager.js';
import { UIController } from './ui/UIController.js';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  console.log('🎮 Initializing Chivalry Journey ENHANCED...');

  // ============ CORE INITIALIZATION ============
  const eventBus = new EventBus();
  const storageManager = new StorageManager();
  const gameState = new GameState(eventBus, storageManager);

  // ============ LOAD DATA ============
  const dataLoader = new DataLoader(gameState);
  const dataLoaded = await dataLoader.loadAll();

  if (!dataLoaded) {
    console.error('Failed to load game data');
    return;
  }

  // ============ LOAD SAVED GAME ============
  gameState.load();

  // ============ UTILS INITIALIZATION ============
  const domCache = new DOMCache();
  const animationLoop = new AnimationLoop(eventBus);
  const offlineProgress = new OfflineProgress(gameState, eventBus);

  // ============ MODULE INITIALIZATION ============

  // Effects (needs to be created early for GoldManager)
  const effectsManager = new EffectsManager(gameState, eventBus, domCache);

  // Boss (needs to be created early for GoldManager)
  const bossManager = new BossManager(gameState, eventBus);

  // Gold (with effects and boss)
  const goldManager = new GoldManager(gameState, eventBus, animationLoop, effectsManager, bossManager);
  const goldUI = new GoldUI(gameState, eventBus, domCache);

  // Progress
  const progressManager = new ProgressManager(gameState, eventBus);
  const progressUI = new ProgressUI(gameState, eventBus, domCache, progressManager);

  // Inventory
  const inventoryManager = new InventoryManager(gameState, eventBus);
  const inventoryUI = new InventoryUI(gameState, eventBus, domCache, inventoryManager);

  // Character
  const characterManager = new CharacterManager(gameState, eventBus, domCache);

  // Chest
  const chestManager = new ChestManager(gameState, eventBus, domCache, animationLoop);

  // Parallax
  const parallaxController = new ParallaxController(eventBus, domCache, animationLoop);

  // Upgrades
  const upgradeManager = new UpgradeManager(gameState, eventBus);
  const upgradeUI = new UpgradeUI(gameState, eventBus, domCache, upgradeManager);

  // Achievements
  const achievementManager = new AchievementManager(gameState, eventBus);
  const achievementUI = new AchievementUI(gameState, eventBus, domCache, achievementManager);

  // Stats
  const statsManager = new StatsManager(gameState, eventBus);

  // ============ UI INITIALIZATION ============

  // Extended Panel Manager with new panels
  const panelManager = new EnhancedPanelManager(gameState, eventBus, domCache);

  // UI Controller
  const modules = {
    goldManager,
    goldUI,
    progressManager,
    progressUI,
    inventoryManager,
    inventoryUI,
    characterManager,
    chestManager,
    parallaxController,
    upgradeManager,
    upgradeUI,
    achievementManager,
    achievementUI,
    statsManager,
    bossManager,
    effectsManager,
    panelManager
  };

  const uiController = new UIController(gameState, eventBus, domCache, animationLoop, modules);

  // ============ INITIALIZE UIs ============
  inventoryUI.initializeShop();
  upgradeUI.initialize();
  achievementUI.initialize();
  renderStats(statsManager, domCache);

  // Boss UI
  setupBossUI(gameState, eventBus, domCache);

  // ============ OFFLINE PROGRESS ============
  offlineProgress.applyOfflineEarnings();

  // ============ START GAME LOOP ============
  animationLoop.start();

  console.log('✅ Chivalry Journey ENHANCED initialized successfully!');
  console.log('📊 Current state:', {
    gold: gameState.getGold(),
    goldPerClick: gameState.getGoldPerClick(),
    goldPerSec: gameState.getGoldPerSec(),
    progress: gameState.getProgress(),
    armorSet: gameState.getArmorSet(),
    upgrades: Object.keys(gameState.getUpgradesData() || {}).length + ' categories',
    achievements: Object.keys(gameState.getAchievementsData() || {}).length + ' total'
  });
}

/**
 * Enhanced Panel Manager with new panels
 */
class EnhancedPanelManager extends PanelManager {
  setupEventListeners() {
    super.setupEventListeners();

    // Add listeners for new panels
    const upgradesBtn = this.domCache.get('upgrades');
    const achievementsBtn = this.domCache.get('achievements');
    const statsBtn = this.domCache.get('stats');

    if (upgradesBtn) {
      upgradesBtn.addEventListener('click', () => this.toggle('upgrades'));
    }
    if (achievementsBtn) {
      achievementsBtn.addEventListener('click', () => this.toggle('achievements'));
    }
    if (statsBtn) {
      statsBtn.addEventListener('click', () => this.toggle('stats'));
    }
  }

  setupKeyboardShortcuts() {
    super.setupKeyboardShortcuts();

    document.addEventListener('keydown', (event) => {
      if (event.key === 'u' || event.key === 'U') {
        this.toggle('upgrades');
      } else if (event.key === 'a' || event.key === 'A') {
        this.toggle('achievements');
      } else if (event.key === 't' || event.key === 'T') {
        this.toggle('stats');
      }
    });
  }
}

/**
 * Render stats panel
 */
function renderStats(statsManager, domCache) {
  const container = domCache.get('statsContainer');
  if (!container) return;

  const updateStats = () => {
    const stats = statsManager.getFormattedStats();
    container.innerHTML = '';

    for (const [label, value] of Object.entries(stats)) {
      const statItem = document.createElement('div');
      statItem.className = 'stat-item';
      statItem.innerHTML = `
        <span class="stat-label">${label}:</span>
        <span class="stat-value">${value}</span>
      `;
      container.appendChild(statItem);
    }
  };

  // Update stats every second
  setInterval(updateStats, 1000);
  updateStats();
}

/**
 * Setup boss UI
 */
function setupBossUI(gameState, eventBus, domCache) {
  const bossContainer = document.getElementById('boss-container');
  const bossHpFill = document.getElementById('boss-hp-fill');
  const bossHpText = document.getElementById('boss-hp-text');

  eventBus.on('boss:spawned', (boss) => {
    if (bossContainer) {
      bossContainer.style.display = 'block';
      if (bossHpFill) bossHpFill.style.width = '100%';
      if (bossHpText) bossHpText.textContent = `${boss.hp} / ${boss.maxHp}`;
    }
  });

  eventBus.on('boss:damaged', (boss) => {
    const percent = (boss.hp / boss.maxHp) * 100;
    if (bossHpFill) bossHpFill.style.width = `${percent}%`;
    if (bossHpText) bossHpText.textContent = `${boss.hp} / ${boss.maxHp}`;
  });

  eventBus.on('boss:defeated', () => {
    if (bossContainer) {
      setTimeout(() => {
        bossContainer.style.display = 'none';
      }, 2000);
    }
  });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
