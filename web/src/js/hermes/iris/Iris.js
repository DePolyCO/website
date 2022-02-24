import { select } from "../utils/Dom";

//
// TODO:
// =====
// + Handle event detection like
//   support for pointer/touch/etc
//
class Iris {
  constructor() {
    /**
     *
     * By default, let events have a
     * passive event handler
     *
     */
    this.defaultOpts = {
      passive: true,
      once: false,
    };
  }

  // Add events
  add(el, type, callback, opts) {
    // conditionally select targets
    let targets = select(el);
    let newOpts = opts ? { ...this.defaultOpts, ...opts } : this.defaultOpts;

    // attach event listeners to all targets
    for (let i = targets.length - 1; i >= 0; i--) {
      const el = targets[i];
      el.addEventListener(type, callback, newOpts);
    }

    // return a remove function for convenience
    return () => {
      this.remove(targets, type, callback);
    };
  }

  // Remove events
  remove(el, type, callback) {
    let targets = select(el);
    for (let i = targets.length - 1; i >= 0; i--) {
      const el = targets[i];
      el.removeEventListener(type, callback, false);
    }
  }
}

/**
 *
 * Global Iris instance
 *
 */

export const iris = new Iris();
