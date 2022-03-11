import { Conductor, Sniff } from "../hermes";
// import { config } from "../components/configPane";

const keyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
};

const getSupport = () => {
  return {
    hasWheelEvent: "onwheel" in document,
    hasMouseWheelEvent: "onmousewheel" in document,
    hasTouch: "ontouchstart" in document,
    hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
    hasPointer: !!window.navigator.msPointerEnabled,
    hasKeyDown: "onkeydown" in document,
  };
};

const support = getSupport();

export class CoreScroll extends Conductor {
  // {
  //   el
  //   emitter
  //   event
  //   touchStart
  //   bodyTouchAction
  // }

  constructor(options) {
    super();

    this.dom = window;

    if (options && options.dom) {
      this.dom = options.dom;
    }

    this.options = {
      // mouseMultiplier: Sniff.windows ? 1 : 0.4,
      mouseMultiplier: 1,
      touchMultiplier: 1,
      firefoxMultiplier: 50,
      keyStep: 120,
      preventTouch: false,
      unpreventTouchClass: "vs-touchmove-allowed",
      useKeyboard: true,
      // useTouch: true,
      ...options,
    };

    this.current = {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this.touchStart = {
      x: 0,
      y: 0,
    };

    // this.bodyTouchAction = null;

    this.listen();
    // this.testMode();
  }

  testMode = () => {
    config
      .addInput(
        {
          mouseMultiplier: this.options.mouseMultiplier,
        },
        "mouseMultiplier",
        { min: 0.1, max: 2, step: 0.1 }
      )
      .on("change", (e) => (this.options.mouseMultiplier = e.value));

    config
      .addInput(
        {
          firefoxMultiplier: this.options.firefoxMultiplier,
        },
        "firefoxMultiplier",
        { min: 0.1, max: 100, step: 1 }
      )
      .on("change", (e) => (this.options.firefoxMultiplier = e.value));
  };

  notify = (e) => {
    const evt = this.current;
    evt.x += evt.deltaX;
    evt.y += evt.deltaY;

    const data = {
      x: evt.x,
      y: evt.y,
      deltaX: evt.deltaX,
      deltaY: evt.deltaY,
      originalEvent: e,
    };

    this.train.forEach((item) => {
      item.update && item.update(data);
    });
  };

  onWheel = (e) => {
    const options = this.options;
    const evt = this.current;

    // In Chrome and in Firefox (at least the new one)
    evt.deltaX = -e.deltaX;
    evt.deltaY = -e.deltaY;

    // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
    // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Deltamodes
    if (Sniff.firefox && e.deltaMode === 1) {
      evt.deltaX *= options.firefoxMultiplier;
      evt.deltaY *= options.firefoxMultiplier;
    }

    evt.deltaX *= options.mouseMultiplier;
    evt.deltaY *= options.mouseMultiplier;

    this.notify(e);
  };

  // onMouseWheel = (e) => {
  //   const evt = this.current;

  //   // In Safari, IE and in Chrome if 'wheel' isn't defined
  //   evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0;
  //   evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;

  //   this.notify(e);
  // };

  onTouchStart = (e) => {
    const t = e.targetTouches ? e.targetTouches[0] : e;
    this.touchStart.x = t.pageX;
    this.touchStart.y = t.pageY;
  };

  onTouchMove = (e) => {
    const options = this.options;
    if (
      options.preventTouch &&
      !e.target.classList.contains(options.unpreventTouchClass)
    ) {
      e.preventDefault();
    }

    const evt = this.current;

    const t = e.targetTouches ? e.targetTouches[0] : e;

    evt.deltaX = (t.pageX - this.touchStart.x) * options.touchMultiplier;
    evt.deltaY = (t.pageY - this.touchStart.y) * options.touchMultiplier;

    this.touchStart.x = t.pageX;
    this.touchStart.y = t.pageY;

    this.notify(e);
  };

  onKeyDown = (e) => {
    const evt = this.current;
    evt.deltaX = evt.deltaY = 0;
    let windowHeight;

    if (e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA")
      return;

    switch (e.keyCode) {
      case keyCodes.LEFT:
      case keyCodes.UP:
        windowHeight = window.innerHeight - 40;
        evt.deltaY = this.options.keyStep;
        this.notify(e);
        break;

      case keyCodes.RIGHT:
      case keyCodes.DOWN:
        windowHeight = window.innerHeight - 40;
        evt.deltaY = -this.options.keyStep;
        this.notify(e);
        break;

      case keyCodes.SPACE:
        windowHeight = window.innerHeight - 40;
        evt.deltaY = windowHeight * (e.shiftKey ? 1 : -1);
        this.notify(e);
        break;

      case keyCodes.PAGEDOWN:
        windowHeight = window.innerHeight - 40;
        evt.deltaY = -windowHeight;
        this.notify(e);
        break;

      case keyCodes.PAGEUP:
        windowHeight = window.innerHeight - 40;
        evt.deltaY = windowHeight;
        this.notify(e);
        break;

      default:
        return;
    }
  };

  listen = () => {
    this.dom.addEventListener("wheel", this.onWheel, this.listenerOptions);

    if (Sniff.touchDevice) {
      this.dom.addEventListener(
        "touchstart",
        this.onTouchStart,
        this.listenerOptions
      );
      this.dom.addEventListener(
        "touchmove",
        this.onTouchMove,
        this.listenerOptions
      );
    } else {
      document.addEventListener("keydown", this.onKeyDown);
    }

    // if (support.hasMouseWheelEvent) {
    //   this.dom.addEventListener(
    //     "mousewheel",
    //     this.onMouseWheel,
    //     this.listenerOptions
    //   );
    // }

    // if (support.hasPointer && support.hasTouchWin) {
    //   this.bodyTouchAction = document.body.style.msTouchAction;
    //   document.body.style.msTouchAction = "none";
    //   this.dom.addEventListener("MSPointerDown", this.onTouchStart, true);
    //   this.dom.addEventListener("MSPointerMove", this.onTouchMove, true);
    // }
  };

  unlisten = () => {
    this.dom.removeEventListener("wheel", this.onWheel);

    // if (support.hasMouseWheelEvent) {
    //   this.dom.removeEventListener("mousewheel", this.onMouseWheel);
    // }

    if (Sniff.touchDevice) {
      this.dom.removeEventListener("touchstart", this.onTouchStart);
      this.dom.removeEventListener("touchmove", this.onTouchMove);
    } else {
      document.removeEventListener("keydown", this.onKeyDown);
    }

    // if (support.hasPointer && support.hasTouchWin) {
    //   document.body.style.msTouchAction = this.bodyTouchAction;
    //   this.dom.removeEventListener("MSPointerDown", this.onTouchStart, true);
    //   this.dom.removeEventListener("MSPointerMove", this.onTouchMove, true);
    // }
  };

  destroy = () => {
    this.unlisten();
  };
}

export const corescroller = new CoreScroll();
