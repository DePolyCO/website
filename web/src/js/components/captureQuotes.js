import {
  qs,
  qsa,
  clamp,
  getOffsetTop,
  LerpController,
  ro,
  ticker,
  Ease,
  bounds,
  iris,
} from "../hermes";
import { Reveal } from "../reveal";
import { corescroller, smoothscroller } from "../scroller";

export class CaptureQuotes {
  constructor() {
    this.dom = qs("#quotes-list");
    this.targets = qsa(".quote", this.dom);

    this.state = {
      ease: Ease["io2"],
      slides: {
        active: 0,
        no: this.targets.length,
      },
      scroll: {
        inertia: 0.075,
        target: 0,
        cur: 0.001,
      },
      page: { height: 0, offset: 0 },
      lock: false,
      boundRange: new Float32Array(2),
    };
    this.lerp = new LerpController(this.state.scroll);

    this.init();
    this.resize();

    this.setActive(0);
  }

  clamp = (y) => {
    return clamp(
      y,
      -smoothscroller.state.page.height - this.state.page.height,
      0
    );
  };

  init = () => {
    this.reveals = this.targets.map(
      (item) =>
        new Reveal({
          targets: qsa(".quote-reveal", item),
          stagger: 50,
          delay: 150,
        })
    );

    this.scrollID = corescroller.add({ update: this.onScroll });
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });
  };

  onScroll = ({ deltaY = 0 }) => {
    if (smoothscroller.hasOtherLock("capture-quotes")) return;
    this.state.scroll.cur = this.clamp(this.state.scroll.cur + deltaY);
  };

  setActive = (i) => {
    if (i < 0) return;
    this.targets[i].classList.add("active");

    // handle reveal
    const r = this.reveals[i];
    const t = r.tween.train;
    if (t.length && t[0].anim.tweens.progress > 0.25) {
      r.play({
        from: 110,
        to: 0,
        stagger: 150,
        delay: 250,
        visible: true,
        easing: "o6",
        duration: 1750,
      });
    } else {
      r.playTo({
        to: 0,
        stagger: 150,
        delay: 250,
        visible: true,
        easing: "o6",
        duration: 1750,
      });
    }
  };

  setInactive = (i = this.state.active) => {
    if (i < 0) return;
    this.targets[i].classList.remove("active");
    this.reveals[i].playTo({
      to: -110,
      stagger: 0,
      delay: 0,
      visible: false,
      easing: "o4",
      duration: 1250,
    });
  };

  update = () => {
    const { scroll, boundRange, slides, page } = this.state;

    if (!this.lerp.needsUpdate()) return;
    this.lerp.update();

    const ycur = -scroll.cur;
    const y = -scroll.target;

    if (ycur > boundRange[0] && ycur < boundRange[1]) {
      // engage lock
      if (!this.state.lock) {
        this.state.lock = true;
        smoothscroller.lock("capture-quotes");
      }

      const progress = (y - boundRange[0]) / page.height;
      // const progress = invlerp(boundRange[0], boundRange[1], y);
      const activeSlide = clamp(
        Math.floor(progress * slides.no),
        0,
        this.state.slides.no - 1
      );

      if (slides.active !== activeSlide) {
        //   deactivate current slide
        this.setInactive(slides.active);
        //   activate new slide
        this.setActive(activeSlide);
        slides.active = activeSlide;
      }
    } else if (this.state.lock) {
      // unlock if not necessary
      this.state.lock = false;
      smoothscroller.unlock("capture-quotes");
    }
  };

  resize = () => {
    const top = getOffsetTop(this.dom);
    const { height } = bounds(this.dom);

    const { page, slides, boundRange } = this.state;

    page.offset = 1 * window.innerHeight;
    page.height = page.offset * slides.no; // 5 items -> scroll offset for each item
    const stickyPoint = (window.innerHeight - height) / 2 + 25; // middle of page

    boundRange[0] = top - stickyPoint;
    boundRange[1] = top - stickyPoint + page.height;
  };

  destroy = () => {
    corescroller.remove(this.scrollID);
    ro.remove(this.roID);
    ticker.remove(this.tickID);

    this.reveals.forEach((reveal) => reveal.destroy());
    this.state.lock && this.unlisten.forEach((unlisten) => unlisten());
  };
}
