/**
 * CharacterManager - Handles character appearance and animations
 * Consolidates sprite update logic (fixes duplication bug)
 */
export class CharacterManager {
  constructor(gameState, eventBus, domCache) {
    this.gameState = gameState;
    this.domCache = domCache;

    // Sprite mapping
    this.spriteMap = {
      iron: '/assets/characters/ironKnight.png',
      gold: '/assets/characters/goldKnight.png',
      diamond: '/assets/characters/diamondKnight.png',
      nezerit: '/assets/characters/nezeritKnight.png',
      default: '/assets/characters/basicKnight.png'
    };

    // Listen for armor set changes
    eventBus.on('armorSet:changed', (setName) => {
      this.updateAppearance(setName);
    });

    // Listen for enemy clicks for attack animation
    this.setupAttackAnimation();

    // Initial render
    this.updateAppearance(gameState.getArmorSet());
  }

  /**
   * Update character appearance based on armor set
   * Single source of truth for sprite updates
   * @param {string|null} setName - Armor set name
   */
  updateAppearance(setName) {
    const basicKnight = this.domCache.get('basicKnight');
    if (!basicKnight) return;

    const spritePath = this.spriteMap[setName] || this.spriteMap.default;
    basicKnight.src = spritePath;

    console.log('Character appearance updated:', setName || 'basic');
  }

  /**
   * Setup attack animation on enemy click
   */
  setupAttackAnimation() {
    const basicKnight = this.domCache.get('basicKnight');
    const ennemy = this.domCache.get('ennemy');

    if (!basicKnight || !ennemy) return;

    // We'll add the event listener in the main initialization
    // but store the animation logic here
    this.attackAnimation = () => {
      basicKnight.classList.add('attack');
      ennemy.classList.add('damage');

      setTimeout(() => {
        basicKnight.classList.remove('attack');
        ennemy.classList.remove('damage');
      }, 500);
    };
  }

  /**
   * Play attack animation
   */
  playAttack() {
    if (this.attackAnimation) {
      this.attackAnimation();
    }
  }
}
