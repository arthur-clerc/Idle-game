/**
 * AnimationLoop - Single requestAnimationFrame loop for all timed behaviors
 * Replaces multiple setInterval calls for better performance
 * Emits 'frame' event for smooth animations and 'tick' event every second
 */
export class AnimationLoop {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.isRunning = false;
    this.lastTickTime = 0;
    this.rafId = null;
  }

  /**
   * Start the animation loop
   */
  start() {
    if (this.isRunning) {
      console.warn('AnimationLoop already running');
      return;
    }

    this.isRunning = true;
    this.lastTickTime = Date.now();
    this.loop();
  }

  /**
   * Stop the animation loop
   */
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Main animation loop
   * @param {number} timestamp - Current timestamp from requestAnimationFrame
   */
  loop(timestamp = Date.now()) {
    if (!this.isRunning) return;

    // Emit frame event for smooth animations (60fps)
    this.eventBus.emit('frame', timestamp);

    // Emit tick event every second
    const now = Date.now();
    if (now - this.lastTickTime >= 1000) {
      this.eventBus.emit('tick');
      this.lastTickTime = now;
    }

    // Continue loop
    this.rafId = requestAnimationFrame((ts) => this.loop(ts));
  }

  /**
   * Pause the loop
   */
  pause() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Resume the loop
   */
  resume() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTickTime = Date.now();
    this.loop();
  }
}
