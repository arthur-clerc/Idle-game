/**
 * PanelManager - Simplified shop/inventory toggle logic
 * Replaces complex boolean logic with clean state machine
 */
export class PanelManager {
  constructor(gameState, eventBus, domCache) {
    this.gameState = gameState;
    this.eventBus = eventBus;
    this.domCache = domCache;

    // Setup event listeners
    this.setupEventListeners();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  /**
   * Setup click event listeners for shop and inventory buttons
   */
  setupEventListeners() {
    const shopButton = this.domCache.get('shop');
    const inventoryButton = this.domCache.get('inventory');

    if (shopButton) {
      shopButton.addEventListener('click', () => this.toggle('shop'));
    }

    if (inventoryButton) {
      inventoryButton.addEventListener('click', () => this.toggle('inventory'));
    }
  }

  /**
   * Setup keyboard shortcuts (s for shop, i for inventory)
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 's' || event.key === 'S') {
        this.toggle('shop');
      } else if (event.key === 'i' || event.key === 'I') {
        this.toggle('inventory');
      }
    });
  }

  /**
   * Toggle a panel (shop or inventory)
   * @param {string} panel - Panel name ('shop' or 'inventory')
   */
  toggle(panel) {
    const activePanel = this.gameState.getActivePanel();

    if (activePanel === panel) {
      // Close if already open
      this.close();
    } else {
      // Open new panel (closes any currently open panel)
      this.open(panel);
    }
  }

  /**
   * Open a panel
   * @param {string} panel - Panel name ('shop' or 'inventory')
   */
  open(panel) {
    // Close currently open panel if any
    const activePanel = this.gameState.getActivePanel();
    if (activePanel) {
      this.closePanel(activePanel);
    }

    // Open new panel
    this.openPanel(panel);

    // Update state
    this.gameState.setActivePanel(panel);
  }

  /**
   * Close the currently open panel
   */
  close() {
    const activePanel = this.gameState.getActivePanel();
    if (activePanel) {
      this.closePanel(activePanel);
      this.gameState.setActivePanel(null);
    }
  }

  /**
   * Open a specific panel element
   * @param {string} panel - Panel name
   */
  openPanel(panel) {
    const panelName = `aside${this.capitalize(panel)}`;
    const panelElement = this.domCache.get(panelName);

    if (panelElement) {
      panelElement.classList.add('open');
    }
  }

  /**
   * Close a specific panel element
   * @param {string} panel - Panel name
   */
  closePanel(panel) {
    const panelName = `aside${this.capitalize(panel)}`;
    const panelElement = this.domCache.get(panelName);

    if (panelElement) {
      panelElement.classList.remove('open');
    }
  }

  /**
   * Capitalize first letter of a string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
