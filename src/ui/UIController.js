/**
 * UIController - Coordinates all UI modules
 * Central initialization and management point for UI
 */
export class UIController {
  constructor(gameState, eventBus, domCache, animationLoop, modules) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;
    this.modules = modules;

    // Initialize UI
    this.initialize();
  }

  /**
   * Initialize all UI components
   */
  initialize() {
    // Hide initial message after 7 seconds
    this.hideInitialMessage();

    // Setup reset button
    this.setupResetButton();

    // Setup enemy click handler
    this.setupEnemyClickHandler();

    // Setup drag prevention
    this.setupDragPrevention();
  }

  /**
   * Hide initial message
   */
  hideInitialMessage() {
    const message = this.domCache.get('message');
    if (message) {
      setTimeout(() => {
        message.style.display = 'none';
      }, 7000);
    }
  }

  /**
   * Setup reset button handler
   */
  setupResetButton() {
    const resetButton = this.domCache.get('reset');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
          this.gameState.reset();
        }
      });
    }
  }

  /**
   * Setup enemy click handler
   */
  setupEnemyClickHandler() {
    const ennemy = this.domCache.get('ennemy');
    if (!ennemy) return;

    // Sound effect
    const sound = new Audio('assets/son/metal-whoosh-hit.mp3');

    ennemy.addEventListener('click', () => {
      // Update game state
      this.modules.goldManager.handleClick();
      this.modules.progressManager.handleClick();

      // Play animations
      this.modules.characterManager.playAttack();

      // Play sound
      sound.play().catch(e => console.error('Failed to play sound:', e));
    });
  }

  /**
   * Setup drag prevention for chest container
   */
  setupDragPrevention() {
    const chestContainer = this.domCache.get('chestContainer');
    if (chestContainer) {
      chestContainer.addEventListener('dragstart', (e) => {
        e.preventDefault();
      });
    }
  }
}
