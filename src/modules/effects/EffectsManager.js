/**
 * EffectsManager - Handles visual effects (particles, combos, crits)
 */
export class EffectsManager {
  constructor(gameState, eventBus, domCache) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;

    this.comboCount = 0;
    this.comboTimer = null;

    // Listen for clicks to trigger effects
    eventBus.on('gold:changed', () => this.onGoldGained());
  }

  /**
   * Handle gold gained - show floating text
   */
  onGoldGained() {
    // Could add particles or floating gold numbers here
  }

  /**
   * Handle click with combo system
   * @param {number} goldGained - Amount of gold gained
   */
  handleClick(goldGained) {
    // Increment combo
    this.comboCount++;

    // Check for critical hit
    const critChance = this.gameState.getUpgradeMultipliers().critChance;
    const isCrit = Math.random() * 100 < critChance;

    if (isCrit) {
      const critMultiplier = this.gameState.getUpgradeMultipliers().critMultiplier;
      goldGained *= critMultiplier;
      this.showCriticalHit(goldGained);
    }

    // Show floating gold number
    this.showFloatingGold(goldGained, isCrit);

    // Create gold particles
    this.createGoldParticles();

    // Update combo display
    this.updateCombo();

    // Reset combo timer
    clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.comboCount = 0;
      this.updateCombo();
    }, 1000);

    return isCrit ? goldGained : 0; // Return bonus gold if crit
  }

  /**
   * Show critical hit effect
   * @param {number} amount - Amount of gold
   */
  showCriticalHit(amount) {
    const ennemy = this.domCache.get('ennemy');
    if (ennemy) {
      ennemy.classList.add('critical-hit');
      setTimeout(() => ennemy.classList.remove('critical-hit'), 300);
    }

    // Show CRITICAL text
    this.showFloatingText('CRITICAL!', '#ff0000', true);
  }

  /**
   * Show floating gold number
   * @param {number} amount - Amount of gold
   * @param {boolean} isCrit - Is critical hit
   */
  showFloatingGold(amount, isCrit = false) {
    const ennemy = this.domCache.get('ennemy');
    if (!ennemy) return;

    const rect = ennemy.getBoundingClientRect();

    const floatingText = document.createElement('div');
    floatingText.className = `floating-gold ${isCrit ? 'critical' : ''}`;
    floatingText.textContent = `+${amount.toLocaleString()} 💰`;
    floatingText.style.left = `${rect.left + rect.width / 2}px`;
    floatingText.style.top = `${rect.top}px`;

    document.body.appendChild(floatingText);

    setTimeout(() => {
      if (document.body.contains(floatingText)) {
        document.body.removeChild(floatingText);
      }
    }, 1500);
  }

  /**
   * Show floating text
   * @param {string} text - Text to show
   * @param {string} color - Text color
   * @param {boolean} large - Large text
   */
  showFloatingText(text, color = '#ffff00', large = false) {
    const ennemy = this.domCache.get('ennemy');
    if (!ennemy) return;

    const rect = ennemy.getBoundingClientRect();

    const floatingText = document.createElement('div');
    floatingText.className = `floating-text ${large ? 'large' : ''}`;
    floatingText.textContent = text;
    floatingText.style.color = color;
    floatingText.style.left = `${rect.left + rect.width / 2}px`;
    floatingText.style.top = `${rect.top - 50}px`;

    document.body.appendChild(floatingText);

    setTimeout(() => {
      if (document.body.contains(floatingText)) {
        document.body.removeChild(floatingText);
      }
    }, 1000);
  }

  /**
   * Create gold particles
   */
  createGoldParticles() {
    const ennemy = this.domCache.get('ennemy');
    if (!ennemy) return;

    const rect = ennemy.getBoundingClientRect();

    // Create 3-5 particles
    const particleCount = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      particle.textContent = '💰';

      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      const angle = (Math.random() * Math.PI * 2);
      const distance = 50 + Math.random() * 50;

      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);

      document.body.appendChild(particle);

      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 800);
    }
  }

  /**
   * Update combo display
   */
  updateCombo() {
    let comboElement = document.getElementById('combo-counter');

    if (this.comboCount > 1) {
      if (!comboElement) {
        comboElement = document.createElement('div');
        comboElement.id = 'combo-counter';
        document.body.appendChild(comboElement);
      }

      comboElement.textContent = `COMBO x${this.comboCount}`;
      comboElement.className = 'combo-counter show';
    } else if (comboElement) {
      comboElement.className = 'combo-counter';
    }
  }
}
