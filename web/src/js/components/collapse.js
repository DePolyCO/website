import {
  Ease,
  qs,
  ro,
  LerpController,
  ticker,
  getOffsetTop,
  bounds,
  clamp,
  invlerp,
  lerp,
  qsa,
} from "../hermes";
import { smoothscroller, corescroller } from "../scroller";

import { Reveal } from "../reveal";

export class Collapse {
  constructor() {
    this.window = qs("#enhanced-slides--wrapper");
    this.dom = qs("#enhanced-slides", this.window);

    const slides = qsa(".enhanced-slide", this.dom);

    this.state = {
      ease: Ease["io1"],
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
      slides: {
        dom: slides,
        no: slides.length,
        active: 0,
      },
    };
    this.lerp = new LerpController(this.state.scroll);
    this.reveal = {
      arr: qsa(".enhanced-desc > div", this.dom).map(
        (item) =>
          new Reveal({
            targets: item,
            stagger: 50,
          })
      ),
    };

    this.init();
  }

  init = () => {
    this.scrollID = corescroller.add({ update: this.onScroll });
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });

    this.resize();
    this.initState();
  };

  initState = () => {
    this.reveal.arr[0].play({
      from: 100,
      to: 0,
      stagger: 50,
      delay: 250,
      duration: 1750,
      easing: "o6",
    });
  };

  onScroll = ({ deltaY }) => {
    if (smoothscroller.hasOtherLock("collapse")) return;
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
    const { scroll, boundRange, slides } = this.state;

    const ycur = -scroll.cur;

    if (ycur > boundRange[0] && ycur < boundRange[1]) {
      if (!this.lerp.needsUpdate()) return;
      this.lerp.update();
      const y = -scroll.target;

      // engage lock
      if (!this.state.lock) {
        this.state.lock = true;
        smoothscroller.lock("collapse");
      }

      const progress = invlerp(boundRange[0], boundRange[1], y);
      const activeSlide = Math.floor(this.state.ease(progress) * slides.no);

      if (slides.active !== activeSlide) {
        //   deactivate current slide
        this.setInactive(slides.dom[slides.active], slides.active);
        //   activate new slide
        this.setActive(slides.dom[activeSlide], activeSlide);
        slides.active = activeSlide;
      }
    } else if (this.state.lock) {
      // unlock if not necessary
      this.state.lock = false;
      smoothscroller.unlock("collapse");
    }
  };

  setActive(dom, i) {
    dom?.classList.add("active");
    this.reveal.arr[i].tween.do("destroy");
    this.reveal.arr[i].play({
      from: 100,
      to: 0,
      stagger: 50,
      delay: 250,
      duration: 1750,
      easing: "o6",
    });
  }

  setInactive(dom, i) {
    dom?.classList.remove("active");
    this.reveal.arr[i].tween.do("destroy");
    this.reveal.arr[i].playTo({
      to: -100,
      stagger: 0,
      delay: 0,
      duration: 1000,
      easing: "o6",
    });
  }

  setSummary() {}

  setNotSummary() {}

  resize = () => {
    const top = getOffsetTop(this.dom);
    const { slides } = this.state;
    this.state.page.width =
      bounds(slides.dom[slides.active]).width * (slides.no - 1) -
      bounds(this.window).width;

    const stickyPoint = window.innerHeight * 0.25; // 20vh from top

    this.state.boundRange[0] = top - stickyPoint;
    this.state.boundRange[1] = top - stickyPoint + this.state.page.width;

    // scrollable width
    // console.log(this.state.page.width);

    this.update();
  };

  destroy = () => {
    corescroller.remove(this.scrollID);
    ro.remove(this.roID);
    ticker.remove(this.tickID);
  };
}
