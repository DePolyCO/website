import {
  ro,
  LerpController,
  ticker,
  qs,
  qsa,
  Sniff,
  clamp,
  bounds,
  Conductor,
  iris,
} from "../hermes";
import { corescroller } from "./core";
import { Tracker } from "./tracker";

// import { config } from "../components/configPane";

const DELTA = 0.001002;

export class Smooth extends Conductor {
  constructor({
    inertia = Sniff.touchDevice ? 1 : 0.075,
    dom = document.documentElement,
    isWindow = true,
    window,
  } = {}) {
    super();

    this.settings = {
      inertia,
      dom,
      isWindow,
      window,
    };

    // if (Sniff.touchDevice) return;

    this.common();
    this.init();
    this.resize();
    this.style();
    // this.testMode();
  }

  common() {
    this.scrollContent = this.settings.dom;
    this.scrollCover = qs("#scroll-cover");

    this.tracker = new Tracker();
    this.scrollID = corescroller.add({ update: this.setScroll });
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });
  }

  init() {
    this.clearState();

    this.scrollSections = qsa(`[data-scroll-section]`, this.scrollContent);
    this.scrollSections =
      this.scrollSections.length === 0
        ? [this.scrollContent]
        : this.scrollSections;

    this.scrollSections.forEach((el) => this.tracker.add({ dom: el }));
  }

  // testMode = () => {
  //   const sense = config.addInput(
  //     {
  //       sensitivity: this.settings.inertia * 1000,
  //     },
  //     "sensitivity",
  //     { min: 1, max: 100, step: 1 }
  //   );

  //   sense.on("change", (e) => {
  //     const val = e.value / 1000;
  //     this.state.scroll.y.inertia = val;
  //     this.lerp.y.setInertia(val);
  //   });
  // };

  clearState = () => {
    this.state = {
      scroll: {
        x: { inertia: this.settings.inertia, target: DELTA, cur: 0 },
        y: { inertia: this.settings.inertia, target: DELTA, cur: 0 },
      },
      page: {
        height: 0,
        width: 0,
      },
      locks: [],
    };
    this.lerp = {
      x: new LerpController(this.state.scroll.x),
      y: new LerpController(this.state.scroll.y),
    };
  };

  style() {
    if (Sniff.touchDevice) return;
    this.scrollContent.style.position = `fixed`;
  }

  clampY = (y) => {
    return clamp(y, -this.state.page.height, 0);
  };

  clampX = (x) => {
    return clamp(x, 0, this.state.page.width);
  };

  setScroll = ({ deltaX, deltaY, force = false }) => {
    if (this.isLocked && !force) return;

    const { x, y } = this.state.scroll;
    x.cur = this.clampX(x.cur + deltaX);
    y.cur = this.clampY(y.cur + deltaY);
  };

  update = () => {
    if (Sniff.touchDevice) return;
    const { x, y } = this.state.scroll;

    if (!this.lerp.x.needsUpdate() && !this.lerp.y.needsUpdate()) return;

    this.lerp.x.update();
    this.lerp.y.update();

    x.target = this.clampX(x.target);
    y.target = this.clampY(y.target);

    this.tracker.setScroll(x.target, -y.target);

    this.sail();
    this.render();

    const data = {
      x: x.target,
      y: y.target,
      deltaX: x.target - x.cur,
      deltaY: y.target - y.cur,
    };
    for (const fn of this.train) {
      fn.update(data);
    }
  };

  sail = () => {
    this.scrollCover.style.pointerEvents =
      this.lerp.y.delta + this.lerp.x.delta > 10 ? "all" : "none";
  };

  render = () => {
    if (Sniff.touchDevice) return;
    this.tracker.detectElements();

    const { x, y } = this.state.scroll;

    this.tracker.train.forEach((item, i) => {
      if (item.visible) {
        // item,visible -> should be rendered
        this.setVisible(item, i, x, y);
      } else if (item.isVisible) {
        // isVisible -> actually visible on screen
        // thus we skip the elements already marked invisible
        this.setInvisible(item, i, x, y);
      }
    });
  };

  setVisible = (item, i, x, y) => {
    item.isVisible = true;
    Object.assign(item.dom.style, {
      transform: `translate3d(0, ${y.target}px, 0)`,
      pointerEvents: `all`,
      opacity: 1,
    });
  };

  setInvisible = (item, i, x, y) => {
    item.isVisible = false;
    Object.assign(item.dom.style, {
      transform: `none`,
      pointerEvents: `none`,
      opacity: 0,
    });
  };

  resize = ({ vw, vh } = { vw: window.innerWidth, vh: window.innerHeight }) => {
    // recalculate page height
    const { height, width } = bounds(this.scrollContent);
    const { page } = this.state;

    if (this.settings.isWindow) {
      vh = vh ? vh : window.innerHeight;
      vw = vw ? vw : window.innerWidth;
      page.height = Math.max(height, vh) - vh;
      page.width = Math.max(width, vw) - vw;
    } else {
      const windowBounds = bounds(this.settings.window);
      page.height = Math.max(height, windowBounds.height) - windowBounds.height;
      page.width = Math.max(width, windowBounds.width) - windowBounds.width;
    }

    // undo transforms to get accurate bounds in this.tracker
    // this.tracker.train.forEach((item) => (item.dom.style.transform = "none"));

    // set cur
    this.setScroll({ deltaX: 1, deltaY: 1, force: true });
    // set target
    // const { x, y } = this.state.scroll;
    // x.target = this.clampX(x.cur + DELTA);
    // y.target = this.clampY(y.cur + DELTA);

    this.tracker.resize();

    this.update();
  };

  destroy = () => {
    this.tracker.destroy();
    corescroller.remove(this.scrollID);
    ticker.remove(this.tickID);
    ro.remove(this.roID);
  };

  lock = (name = "default") => {
    if (!this.hasLock(name)) {
      this.state.locks.push(name);
    }
  };

  unlock = (name = "default") => {
    const idx = this.state.locks.indexOf(name);
    if (idx > -1) {
      this.state.locks.splice(idx, 1);
    }
  };

  hasLock(name = "default") {
    return this.state.locks.includes(name);
  }

  hasOtherLock(name = "default") {
    for (let i = 0, n = this.state.locks.length; i < n; i++) {
      const lock = this.state.locks[i];
      if (lock !== name) {
        return true;
      }
    }
    return false;
  }

  get isLocked() {
    return this.state.locks.length > 0;
  }
}

export const smoothscroller = new Smooth({ inertia: 0.08 });
