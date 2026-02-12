/**
 * ParallaxController - Handles parallax background effect
 * Optimized with requestAnimationFrame instead of direct mousemove updates
 */
export class ParallaxController {
  constructor(eventBus, domCache, animationLoop) {
    this.domCache = domCache;
    this.baseZoom = 1.1;

    // Mouse position (centered by default)
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    // Get parallax layers
    this.layers = domCache.get('parallaxLayers');

    // Initial positioning
    this.updateLayers();

    // Listen for mousemove (just update position, don't render)
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Update on animation frame for smooth 60fps updates
    eventBus.on('frame', () => this.updateLayers());
  }

  /**
   * Update parallax layers based on mouse position
   * Batched DOM updates for better performance
   */
  updateLayers() {
    if (!this.layers || this.layers.length === 0) return;

    this.layers.forEach((layer, index) => {
      const speed = index + 1;
      const x = (window.innerWidth / 2 - this.mouseX * speed) / 100;
      const y = (window.innerHeight / 2 - this.mouseY * speed) / 100;

      layer.style.transform = `translateX(${x}px) translateY(${y}px) scale(${this.baseZoom})`;
    });
  }
}
