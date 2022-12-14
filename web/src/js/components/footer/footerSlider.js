import {
  LerpController,
  qs,
  clamp,
  bounds,
  ticker,
  ro,
  Ease,
  lerp,
  Sniff,
} from "../../hermes";
import { corescroller, smoothscroller } from "../../scroller";

export class FooterSlider {
  constructor({ dom }) {
    this.dom = dom;
    this.scrollWindow = qs("[data-scroll-window]", this.dom);
    this.scrollContent = qs("[data-scroll-item]", this.dom);

    if (Sniff.touchDevice) return;

    this.init();
    this.common();
  }

  init = () => {
    smoothscroller.unlock("footer");
    this.clearState();
    this.resize();
    this.scrollContent.style.transform = `none`;
  };

  common = () => {
    this.ease = Ease["io1"];

    ro.add({ update: this.resize });
    corescroller.add({ update: this.onScroll });
    ticker.add({ update: this.update });
  };

  clearState = () => {
    this.state = {
      scroll: {
        inertia: 0.075,
        target: 0,
        cur: 0.001,
      },
      lock: false,
      page: {
        width: 0,
      },
    };
    this.lerp = new LerpController(this.state.scroll);
  };

  clamp = (y) => {
    return clamp(
      y,
      -smoothscroller.state.page.height - this.state.page.width,
      0
    );
  };

  onScroll = ({ deltaY }) => {
    if (smoothscroller.hasOtherLock("footer")) return;
    this.state.scroll.cur = this.clamp(this.state.scroll.cur + deltaY);
  };

  update = () => {
    if (Sniff.touchDevice) return;
    const { scroll, page } = this.state;
    const { height } = smoothscroller.state.page;

    if (!this.lerp.needsUpdate()) return;
    this.lerp.update();

    const y = -scroll.target;

    // overflow scroll active
    if (y > height) {
      // lock scroller
      if (!this.state.lock) {
        this.state.lock = true;
        smoothscroller.lock("footer");
      }

      // calculate eased lerp
      const lerpY = lerp(0, -page.width, this.ease((y - height) / page.width));

      // apply transform
      this.scrollContent.style.transform = `translate3d(${lerpY}px, 0, 0)`;
    } else if (this.state.lock) {
      // unlock if not necessary
      this.state.lock = false;
      smoothscroller.unlock("footer");
    }
  };

  resize = () => {
    if (Sniff.touchDevice) return;
    const { page } = this.state;
    const { width } = bounds(this.scrollContent);
    page.width = width - bounds(this.scrollWindow).width;
    this.update();
  };
}
