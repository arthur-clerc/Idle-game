/**
 * StorageManager - Abstraction over localStorage with error handling
 * Handles type conversions and graceful degradation
 */
export class StorageManager {
  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }

  /**
   * Get a number from localStorage
   * @param {string} key - Storage key
   * @param {number} defaultValue - Default value if key doesn't exist
   * @returns {number}
   */
  getNumber(key, defaultValue = 0) {
    if (!this.isAvailable) return defaultValue;

    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;

      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    } catch (e) {
      console.error(`Failed to read number "${key}":`, e);
      return defaultValue;
    }
  }

  /**
   * Set a number in localStorage
   * @param {string} key - Storage key
   * @param {number} value - Value to store
   * @returns {boolean} Success status
   */
  setNumber(key, value) {
    if (!this.isAvailable) return false;

    try {
      localStorage.setItem(key, value.toString());
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        this.handleQuotaExceeded();
      } else {
        console.error(`Failed to save number "${key}":`, e);
      }
      return false;
    }
  }

  /**
   * Get a JSON object from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*}
   */
  getJSON(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;

    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;

      return JSON.parse(value);
    } catch (e) {
      console.error(`Failed to read JSON "${key}":`, e);
      return defaultValue;
    }
  }

  /**
   * Set a JSON object in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  setJSON(key, value) {
    if (!this.isAvailable) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        this.handleQuotaExceeded();
      } else {
        console.error(`Failed to save JSON "${key}":`, e);
      }
      return false;
    }
  }

  /**
   * Get a string from localStorage
   * @param {string} key - Storage key
   * @param {string} defaultValue - Default value
   * @returns {string}
   */
  getString(key, defaultValue = '') {
    if (!this.isAvailable) return defaultValue;

    try {
      const value = localStorage.getItem(key);
      return value === null ? defaultValue : value;
    } catch (e) {
      console.error(`Failed to read string "${key}":`, e);
      return defaultValue;
    }
  }

  /**
   * Set a string in localStorage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   */
  setString(key, value) {
    if (!this.isAvailable) return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        this.handleQuotaExceeded();
      } else {
        console.error(`Failed to save string "${key}":`, e);
      }
      return false;
    }
  }

  /**
   * Remove an item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    if (!this.isAvailable) return;

    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove "${key}":`, e);
    }
  }

  /**
   * Clear all localStorage
   */
  clear() {
    if (!this.isAvailable) return;

    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }

  /**
   * Handle quota exceeded error
   * Can be extended to show user notification
   */
  handleQuotaExceeded() {
    console.warn('Storage quota exceeded. Consider clearing old saves.');
    // Could emit event or show user notification here
  }
}
