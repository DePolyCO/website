import { select } from "../utils/Dom";
import { Sniff } from "../utils/Sniff";

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
    this.detect();
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

  detect = () => {
    let type = "pointer";
    let down = "down";
    let up = "up";

    if (Sniff.touchDevice) {
      type = "touch";
      down = "start";
      up = "end";
    }

    this.events = {
      down: `${type}${down}`,
      up: `${type}${up}`,
      move: `${type}move`,
      enter: `${type}enter`,
      leave: `${type}leave`,
    };
  };

  getXY = (e) => {
    return {
      x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
      y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY,
    };
  };
}

/**
 *
 * Global Iris instance
 *
 */

export const iris = new Iris();
