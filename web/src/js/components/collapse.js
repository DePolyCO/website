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
  iris,
  Duration,
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
        inertia: smoothscroller.state.scroll.y.inertia,
        target: 0,
        cur: 0.001,
      },
      page: {
        width: 0,
      },
      lock: false,
      selfLock: false,
      boundRange: new Float32Array(2),
      slides: {
        dom: slides,
        no: slides.length,
        active: 0,
      },
      summary: {
        slides: qsa(".enhanced-slide--summary", this.dom),
        active: false,
        hover: 0,
      },
    };
    this.lerp = new LerpController(this.state.scroll);

    this.reveal = {
      arr: qsa(".enhanced-desc > p", this.dom).map(
        (item) =>
          new Reveal({
            targets: item,
            stagger: 50,
          })
      ),
    };

    this.init();
    // window.collapse = this;
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
    if (smoothscroller.hasOtherLock("collapse") || this.state.selfLock) return;
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
    if (this.state.selfLock) return;

    const { scroll, boundRange, slides, summary } = this.state;

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

        if (activeSlide === slides.no - 1 && !summary.active) {
          summary.active = true;
          this.setSummary();
        } else if (summary.active) {
          this.removeSummary();
          summary.active = false;
        }
      }
    } else if (this.state.lock) {
      // unlock if not necessary
      this.state.lock = false;
      smoothscroller.unlock("collapse");
    }
  };

  setActive(dom, i) {
    dom?.classList.add("active");

    const r = this.reveal.arr[i];
    if (r) {
      r.tween.do("destroy");
      r.play({
        from: 100,
        to: 0,
        stagger: 50,
        delay: 250,
        duration: 1750,
        easing: "o6",
      });

      // briefly lock slide
      this.state.selfLock = true;
      new Duration({
        duration: 1250,
        complete: () => {
          this.state.selfLock = false;
        },
      });
    }
  }

  setInactive(dom, i) {
    dom?.classList.remove("active");
    this.reveal.arr[i]?.tween.do("destroy");
    this.reveal.arr[i]?.playTo({
      to: -100,
      stagger: 0,
      delay: 0,
      duration: 1000,
      easing: "o6",
    });
  }

  setSummary() {
    this.listen();
    this.dom.classList.add("summary");
  }

  removeSummary() {
    this.unlisten();
    this.handleLeave(this.state.summary.hover);
    this.dom.classList.remove("summary");
  }

  listen = () => {
    this.unlisteners = [];
    this.state.slides.dom.forEach((el, i) => {
      this.unlisteners.push(
        iris.add(el, iris.events.enter, (e) => this.handleEnter(i, e))
      );
      this.unlisteners.push(
        iris.add(el, iris.events.leave, (e) => this.handleLeave(i, e))
      );
    });
  };

  unlisten = () => {
    this.unlisteners.forEach((e) => e());
  };

  handleEnter = (i) => {
    this.state.summary.hover = i;
    this.state.summary.slides[i]?.classList.add("active");
  };

  handleLeave = (i) => {
    this.state.summary.slides[i]?.classList.remove("active");
  };

  resize = () => {
    const top = getOffsetTop(this.dom);
    const { slides, page, boundRange } = this.state;
    page.offset = window.innerHeight;
    page.width = page.offset * (slides.no - 1) - bounds(this.window).width;

    const stickyPoint = window.innerHeight * 0.25; // 20vh from top

    boundRange[0] = top - stickyPoint;
    boundRange[1] = top - stickyPoint + page.width;

    // scrollable width
    // console.log(this.state.page.width);

    this.update();
  };

  destroy = () => {
    corescroller.remove(this.scrollID);
    ro.remove(this.roID);
    ticker.remove(this.tickID);
    smoothscroller.unlock("collapse");
  };
}
