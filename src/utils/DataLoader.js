/**
 * DataLoader - Load and validate game data from JSON files
 * Centralized data loading with error handling
 */
import { validateArmorData, validateBonusData, fetchAndValidateJSON } from './validators.js';

export class DataLoader {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Load all game data
   * @returns {Promise<boolean>} Success status
   */
  async loadAll() {
    try {
      await Promise.all([
        this.loadArmorData(),
        this.loadBonusData(),
        this.loadUpgradesData(),
        this.loadAchievementsData()
      ]);

      console.log('All game data loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load game data:', error);
      this.handleLoadError(error);
      return false;
    }
  }

  /**
   * Load armor sets data
   * @returns {Promise<void>}
   */
  async loadArmorData() {
    try {
      const data = await fetchAndValidateJSON('data.json', validateArmorData);
      this.gameState.setArmorSetsData(data.armorSet);
      console.log('Armor data loaded:', Object.keys(data.armorSet).length, 'sets');
    } catch (error) {
      console.error('Failed to load armor data:', error);
      throw error;
    }
  }

  /**
   * Load bonus items data
   * @returns {Promise<void>}
   */
  async loadBonusData() {
    try {
      const data = await fetchAndValidateJSON('bonus.json', validateBonusData);
      this.gameState.setBonusItemsData(data);
      console.log('Bonus data loaded:', Object.keys(data).length, 'items');
    } catch (error) {
      console.error('Failed to load bonus data:', error);
      throw error;
    }
  }

  /**
   * Load upgrades data
   * @returns {Promise<void>}
   */
  async loadUpgradesData() {
    try {
      const response = await fetch('upgrades.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      this.gameState.setUpgradesData(data);
      console.log('Upgrades data loaded');
    } catch (error) {
      console.error('Failed to load upgrades data:', error);
      throw error;
    }
  }

  /**
   * Load achievements data
   * @returns {Promise<void>}
   */
  async loadAchievementsData() {
    try {
      const response = await fetch('achievements.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      this.gameState.setAchievementsData(data);
      console.log('Achievements data loaded:', Object.keys(data).length, 'achievements');
    } catch (error) {
      console.error('Failed to load achievements data:', error);
      throw error;
    }
  }

  /**
   * Handle data loading errors
   * @param {Error} error - The error that occurred
   */
  handleLoadError(error) {
    const message = `Failed to load game data: ${error.message}\n\nPlease refresh the page to try again.`;
    alert(message);
  }
}
