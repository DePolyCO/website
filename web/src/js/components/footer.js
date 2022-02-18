import {
  LerpController,
  qs,
  clamp,
  bounds,
  ticker,
  ro,
  Ease,
  lerp,
} from "../hermes";
import { corescroller, smoothscroller } from "../nscroller";

class Footer {
  constructor() {
    this.dom = qs("#footer");
    this.scrollWindow = qs("[data-scroll-window]", this.dom);
    this.scrollContent = qs("[data-scroll-item]", this.dom);

    this.state = {
      scroll: {
        inertia: 0.075,
        target: 0,
        cur: 0.001,
      },
      page: {
        width: 0,
      },
    };
    this.ease = Ease["io1"];
    this.lerp = new LerpController(this.state.scroll);
  }

  init = () => {
    this.resize();

    ro.add({ update: this.resize });
    corescroller.add({ update: this.onScroll });
    ticker.add({ update: this.update });
  };

  clamp = (y) => {
    return clamp(
      y,
      -smoothscroller.state.page.height - this.state.page.width,
      0
    );
  };

  onScroll = ({ deltaY }) => {
    this.state.scroll.cur = this.clamp(this.state.scroll.cur + deltaY);
  };

  update = () => {
    const { scroll, page } = this.state;
    const { height } = smoothscroller.state.page;

    if (!this.lerp.needsUpdate()) return;
    this.lerp.update();

    const y = -scroll.target;

    // overflow scroll active
    if (y > height) {
      // lock scroller
      if (!smoothscroller.state.locked) {
        smoothscroller.lock();
      }

      // calculate eased lerp
      const lerpY = lerp(0, -page.width, this.ease((y - height) / page.width));

      // apply transform
      this.scrollContent.style.transform = `translate3d(${lerpY}px, 0, 0)`;
    } else if (smoothscroller.state.locked) {
      // unlock if not necessary
      smoothscroller.unlock();
    }
  };

  resize = () => {
    const { page } = this.state;
    const { width } = bounds(this.scrollContent);
    page.width = width - bounds(this.scrollWindow).width;
  };
}

export const footer = new Footer();
