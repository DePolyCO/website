import {
  ro,
  LerpController,
  ticker,
  qsa,
  Sniff,
  clamp,
  bounds,
  Conductor,
} from "../hermes";
import { corescroller } from "./core";
import { tracker } from "./modular";

const DELTA = 0.001002;

export class Smooth extends Conductor {
  constructor() {
    super();
    this.settings = {
      delta: Sniff.touchDevice ? 0.125 : 0.075,
    };
    this.init();
    this.resize();
    this.style();
  }

  init() {
    this.clearState();

    this.scrollContent = document.documentElement;
    this.scrollSections = qsa(`[data-scroll-section]`, this.scrollContent);
    this.scrollSections =
      this.scrollSections.length === 0
        ? [this.scrollContent]
        : this.scrollSections;

    corescroller.add({ update: this.setScroll });
    ticker.add({ update: this.update });
    ro.add({ update: this.resize });

    this.scrollSections.forEach((el) => tracker.add({ dom: el }));
  }

  clearState = () => {
    this.state = {
      scroll: {
        x: { inertia: this.settings.delta, target: DELTA, cur: 0 },
        y: { inertia: this.settings.delta, target: DELTA, cur: 0 },
      },
      page: {
        height: 0,
        width: 0,
      },
    };
    this.lerp = {
      x: new LerpController(this.state.scroll.x),
      y: new LerpController(this.state.scroll.y),
    };
  };

  style() {
    if (Sniff.touchDevice) return;
    document.body.style.overscrollBehavior = `none`;
    document.documentElement.style.position = `fixed`;
  }

  clampY = (y) => {
    return clamp(y, -this.state.page.height, 0);
  };

  clampX = (x) => {
    return clamp(x, 0, this.state.page.width);
  };

  listen = () => {};

  setScroll = ({ deltaX, deltaY }) => {
    const { x, y } = this.state.scroll;
    x.cur = this.clampX(x.cur + deltaX);
    y.cur = this.clampY(y.cur + deltaY);
  };

  update = () => {
    const { scroll } = this.state;
    const { x, y } = scroll;

    if (!this.lerp.x.needsUpdate() && !this.lerp.y.needsUpdate()) return;

    this.lerp.x.update();
    this.lerp.y.update();

    tracker.setScroll(x.target, -y.target);
    this.render();

    const data = { x: x.target, y: y.target };
    for (const fn of this.train) {
      fn.update(data);
    }
  };

  render = () => {
    tracker.detectElements();

    const { scroll } = this.state;
    const { x, y } = scroll;

    tracker.train.forEach((item, i) => {
      if (item.visible) {
        Object.assign(item.dom.style, {
          transform: `translate3d(0, ${y.target}px, 0)`,
          pointerEvents: `all`,
          opacity: 1,
        });
      } else {
        Object.assign(item.dom.style, {
          transform: `none`,
          pointerEvents: `none`,
          opacity: 0,
        });
      }
    });
  };

  resize = ({ vw, vh } = { vw: window.innerWidth, vh: window.innerHeight }) => {
    const { height, width } = bounds(this.scrollContent);
    const { page } = this.state;
    page.height = Math.max(height, vh) - vh;
    page.width = Math.max(width, vw) - vw;

    tracker.train.forEach((item) => (item.dom.style.transform = "none"));
    this.setScroll({ deltaX: DELTA, deltaY: DELTA });
    tracker.resize();

    this.render();
  };
}

export const smoothscroller = new Smooth();
