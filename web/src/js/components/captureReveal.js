import {
  qs,
  qsa,
  LerpController,
  clamp,
  getOffsetTop,
  invlerp,
  ro,
  ticker,
  Ease,
  bounds,
} from "../hermes";
import { Reveal } from "../reveal";
import { corescroller, smoothscroller } from "../scroller";

export class CaptureReveal {
  constructor() {
    this.dom = qs("#numbers-content");
    this.targets = qsa(".number-item", this.dom);

    this.state = {
      ease: Ease["io2"],
      slides: {
        active: 0,
        no: 5,
      },
      scroll: {
        inertia: 0.075,
        target: 0,
        cur: 0.001,
      },
      page: { height: 0 },
      lock: false,
      boundRange: new Float32Array(2),
    };
    this.lerp = new LerpController(this.state.scroll);

    this.resize();
    this.init();
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
          targets: qs(".number-detail", item),
          stagger: 50,
          delay: 150,
        })
    );

    this.scrollID = corescroller.add({ update: this.onScroll });
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });

    this.setActive(0);
  };

  onScroll = ({ deltaY = 0 }) => {
    if (smoothscroller.hasOtherLock("capture-reveal")) return;
    this.state.scroll.cur = this.clamp(this.state.scroll.cur + deltaY);
  };

  setActive = (i) => {
    this.targets[i].classList.add("active");

    // handle reveal
    const r = this.reveals[i];
    const t = r.tween.train;
    if (t.length && t[0].anim.tweens.progress > 0.75) {
      r.play({ from: 110, to: 0, stagger: 75, delay: 250 });
    } else {
      r.playTo({ from: 110, to: 0, stagger: 75, delay: 250 });
    }
  };

  setInactive = (i = this.state.active) => {
    this.targets[i].classList.remove("active");
    const r = this.reveals[i];
    const t = r.tween.train;
    if (t.length && t[0].anim.tweens.progress > 0.75) {
      r.play({ from: 0, to: -110, stagger: 0, delay: 0 });
    } else {
      r.playTo({ from: 0, to: -110, stagger: 0, delay: 0 });
    }
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
        smoothscroller.lock("capture-reveal");
      }

      const progress = invlerp(boundRange[0], boundRange[1], y);
      const activeSlide = Math.floor(this.state.ease(progress) * slides.no);

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
      smoothscroller.unlock("capture-reveal");
    }
  };

  resize = () => {
    const top = getOffsetTop(this.dom);
    const { height } = bounds(this.dom);

    const stickyPoint = (window.innerHeight - height) / 2;

    this.state.page.height = 0.5 * window.innerHeight * 4; // 5 items - scroll offset for each item
    // const stickyPoint = window.innerHeight * 0.125; // 12.5vh from top

    this.state.boundRange[0] = top - stickyPoint;
    this.state.boundRange[1] = top - stickyPoint + this.state.page.height;
  };

  destroy = () => {
    corescroller.remove(this.scrollID);
    ro.remove(this.roID);
    ticker.remove(this.tickID);

    this.reveals.forEach((reveal) => reveal.destroy());
  };
}
