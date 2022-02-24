import {
  Ease,
  ro,
  LerpController,
  ticker,
  getOffsetTop,
  bounds,
  clamp,
  invlerp,
} from "../hermes";
import { smoothscroller, corescroller } from "../scroller";

export class Capture {
  constructor({
    window,
    dom,
    namespace,
    callback,
    stickyPoint = 0.25,
    useWindow = false,
  } = {}) {
    this.window = window;
    this.dom = dom;
    this.namespace = namespace;
    this.callback = callback;
    this.stickyPoint = stickyPoint;
    this.useWindow = useWindow;

    this.state = {
      ease: Ease["io2"],
      scroll: {
        inertia: 0.075,
        target: 0,
        cur: 0.001,
      },
      page: {
        width: 0,
      },
      lock: false,
      boundRange: new Float32Array(2),
    };
    this.lerp = new LerpController(this.state.scroll);

    this.init();
    this.resize();
  }

  init = () => {
    this.scrollID = corescroller.add({ update: this.onScroll });
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });
  };

  onScroll = ({ deltaY }) => {
    if (smoothscroller.hasOtherLock(this.namespace)) return;
    this.state.scroll.cur = this.clamp(this.state.scroll.cur + deltaY);
  };

  clamp = (y) => {
    return clamp(
      y,
      -smoothscroller.state.page.height - this.state.page.width,
      0
    );
  };

  update = () => {
    const { scroll, boundRange } = this.state;

    if (!this.lerp.needsUpdate()) return;
    this.lerp.update();
    // const ycur = -scroll.cur;
    const y = -scroll.target;

    if (y > boundRange[0] && y < boundRange[1]) {
      // engage lock
      if (!this.state.lock) {
        this.state.lock = true;
        smoothscroller.lock(this.namespace);
      }

      const progress = invlerp(boundRange[0], boundRange[1], y);
      this.callback(progress, this.state.ease(progress));
      //
    } else if (this.state.lock) {
      // unlock if not necessary
      this.state.lock = false;
      smoothscroller.unlock(this.namespace);
    }
  };

  resize = () => {
    const top = getOffsetTop(this.dom);
    this.state.page.width =
      bounds(this.dom).width -
      (this.useWindow ? window.innerWidth : bounds(this.window).width);

    const stickyPoint = window.innerHeight * this.stickyPoint; // vh from top

    this.state.boundRange[0] = top - stickyPoint;
    this.state.boundRange[1] = top - stickyPoint + this.state.page.width;

    this.update();
  };

  destroy = () => {
    corescroller.remove(this.scrollID);
    ro.remove(this.roID);
    ticker.remove(this.tickID);
  };
}
