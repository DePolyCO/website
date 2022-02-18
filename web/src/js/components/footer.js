import { LerpController, qs, clamp } from "../hermes";
import { corescroller, smoothscroller } from "../nscroller";

class Footer {
  constructor() {
    this.dom = qs("#footer");
    this.scrollContent = qs("[data-scroll-footer]", this.dom);

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
    this.lerp = new LerpController(this.state.scroll);
  }

  init = () => {
    corescroller.add({ update: this.onScroll });
  };

  clamp = (y) => {
    return clamp(
      y,
      -smoothscroller.state.page.height - this.state.page.width,
      0
    );
  };

  onScroll = ({ y }) => {
    this.state.scroll.cur = this.clamp(y);
  };

  update = () => {
    const { scroll } = this.state;

    if (!this.lerp.needsUpdate()) return;
    this.lerp.update();

    if (this.state.scroll.target > smoothscroller.state.page.height) {
      // lerp footer
    }
  };

  resize = () => {
    const { page } = this.state;
    const { width } = bounds(this.scrollContent);
    page.width = Math.max(width, vw) - vw;
  };
}
