/**
 * validators.js - Data validation functions for JSON loading
 * Ensures loaded data has the expected structure
 */

/**
 * Validate armor set data structure
 * @param {Object} data - Data to validate
 * @returns {Object} Validated data
 * @throws {Error} If validation fails
 */
export function validateArmorData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Armor data must be an object');
  }

  if (!data.armorSet || typeof data.armorSet !== 'object') {
    throw new Error('Missing or invalid armorSet property');
  }

  const armorSets = data.armorSet;
  const expectedSets = ['iron', 'gold', 'diamond', 'nezerit'];
  const expectedPieces = ['sword', 'helmet', 'chest', 'legs'];

  for (const setName of expectedSets) {
    if (!armorSets[setName]) {
      throw new Error(`Missing armor set: ${setName}`);
    }

    for (const pieceName of expectedPieces) {
      const piece = armorSets[setName][pieceName];

      if (!piece) {
        throw new Error(`Missing piece: ${setName}.${pieceName}`);
      }

      // Validate piece properties
      if (typeof piece.id !== 'number') {
        throw new Error(`Invalid id for ${setName}.${pieceName}: must be number`);
      }

      if (!piece.src || typeof piece.src !== 'string') {
        throw new Error(`Invalid src for ${setName}.${pieceName}: must be string`);
      }

      if (typeof piece.price !== 'number' || piece.price < 0) {
        throw new Error(`Invalid price for ${setName}.${pieceName}: must be positive number`);
      }

      if (typeof piece.goldPerSec !== 'number') {
        throw new Error(`Invalid goldPerSec for ${setName}.${pieceName}: must be number`);
      }
    }
  }

  return data;
}

/**
 * Validate bonus items data structure
 * @param {Object} data - Data to validate
 * @returns {Object} Validated data
 * @throws {Error} If validation fails
 */
export function validateBonusData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Bonus data must be an object');
  }

  for (const [itemName, item] of Object.entries(data)) {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid bonus item: ${itemName}`);
    }

    if (typeof item.id !== 'number') {
      throw new Error(`Invalid id for ${itemName}: must be number`);
    }

    if (!item.src || typeof item.src !== 'string') {
      throw new Error(`Invalid src for ${itemName}: must be string`);
    }

    if (typeof item.goldPerSec !== 'number') {
      throw new Error(`Invalid goldPerSec for ${itemName}: must be number`);
    }
  }

  return data;
}

/**
 * Safe JSON fetch with validation
 * @param {string} url - URL to fetch
 * @param {Function} validator - Validation function
 * @returns {Promise<Object>} Validated data
 */
export async function fetchAndValidateJSON(url, validator) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return validator(data);
  } catch (error) {
    console.error(`Failed to load and validate ${url}:`, error);
    throw error;
  }
}
