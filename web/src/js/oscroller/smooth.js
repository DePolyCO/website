import {
  bindAll,
  Conductor,
  qs,
  qsa,
  iris,
  clamp,
  LerpController,
  Sniff,
  round,
  ro,
  bounds,
  Tween,
  map,
} from "../hermes";
import { corescroller } from "./core";

const DELTA = 0.002;

class Smooth extends Conductor {
  constructor(settings) {
    super();

    this.settings = settings;

    // Stub these to avoid init
    // init should be called on page transition
    this.clearState();
    this.scrollSections = [];
    this.scrollCover = qs("#scroll-cover");
    this.lerp = { needsUpdate: () => {} };

    this.style();
    this.listen();

    bindAll(this, ["update", "resize"]);
    corescroller.add({ update: this.update });
    ro.add({ update: this.resize });
  }

  clearState() {
    this.state = {
      scroll: {
        inertia: this.settings.inertia,
        target: DELTA, // small offset to force update on init
        cur: 0,
      },
      drag: {
        isDragging: false,
        snap: {
          x: 0,
          y: 0,
        },
        cur: {
          x: 0,
          y: 0,
        },
        last: {
          x: 0,
          y: 0,
        },
        inertia: 0.01,
        speed: this.settings.dragSpeed,
      },
      locked: false,
    };
  }

  init({ linearGuarantee = true } = {}) {
    this.scrollContent = corescroller.scrollContent;
    this.scrollSections = qsa(`[data-scroll-section]`, this.scrollContent);
    this.scrollSections =
      this.scrollSections.length === 0
        ? [this.scrollContent]
        : this.scrollSections;

    this.clearState();

    // if all sections in a page are linearly organised
    // then we don't need to check every element to render
    // as soon as the first element fails
    // we are guaranteed that all elements
    // after that will fail too

    // TODO: Handle with scroll direction
    this.linearGuarantee = linearGuarantee;

    corescroller.unlock();
    corescroller.setScroll({ x: 0, y: 0 });
    corescroller.resize();

    this.lerp = new LerpController(this.state.scroll);

    this.anchors();

    // prevent image drag for bad browsers
    if (Sniff.firefox || Sniff.safari) {
      this.badBrowsers && this.badBrowsers.forEach((i) => i());
      this.badBrowsers = [];
      qsa("a").forEach((el) => {
        if (qs("img", el)) {
          const u = iris.add(
            el,
            "dragstart",
            (e) => {
              e.preventDefault();
            },
            { passive: false }
          );
          this.badBrowsers.push(u);
        }
      });
    }
    this.resize();
  }

  style() {
    if (Sniff.touchDevice) return;
    document.body.style.overscrollBehavior = `none`;
    corescroller.scrollContent.style.position = `fixed`;
    if (Sniff.firefox) {
      iris.add(
        "img",
        "dragstart",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );
    }
  }

  clamp(y) {
    return clamp(y, 0, this.scrollHeight);
  }

  getXY(e) {
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    return { x, y };
  }

  listen() {
    if (Sniff.touchDevice) return;

    const state = this.state.drag;

    iris.add(window, `pointerdown`, (e) => {
      if (this.state.locked) return;
      state.isDragging = true;
      state.snap = this.getXY(e);
      //   copy to take a snapshot
      state.last = { ...corescroller.state };
    });

    iris.add(window, `pointermove`, (e) => {
      if (!state.isDragging || this.state.locked) return;
      state.cur = this.getXY(e);

      const diffY = (state.cur.y - state.snap.y) * state.speed;
      if (Math.abs(diffY) < 15) return;

      corescroller.setScroll({ y: state.last.y - diffY });
    });

    iris.add(window, `pointerup`, (e) => {
      if (!state.isDragging) return;
      state.isDragging = false;
    });
  }

  anchors() {
    this.unlistenAnchors && this.unlistenAnchors();

    this.unlistenAnchors = iris.add(`[data-scroll-to]`, `click`, (e) => {
      const anchor = e.target.closest("[data-scroll-to]");
      this.scrollByAnchor(anchor);
    });
  }

  resize() {
    if (Sniff.touchDevice) return;

    this.cache = [];
    for (const section of this.scrollSections) {
      // reset transforms to get correct bounds
      section.style.transform = `none`;
    }
    for (const section of this.scrollSections) {
      const b = bounds(section);

      const bottom = b.bottom;
      const top = b.top - corescroller.vh;

      const { progress, visible } = this.getIntersection({ top, bottom });

      const dataset = section.dataset;
      const speed =
        dataset.scrollSpeed !== undefined ? parseFloat(dataset.scrollSpeed) : 1;
      const track = dataset.scrollTrack;
      const hide = dataset.hide !== undefined;

      this.cache.push({
        dom: section,
        top,
        bottom,
        visible,
        progress,
        speed,
        track,
        hide,
        freeze: false,
      });
    }

    this.state.scroll.target += DELTA;
    this.update();
  }

  scrollByAnchor(anchor, snap = false) {
    if (!anchor) return;
    const t = anchor.dataset.scrollTo;
    const o = parseFloat(anchor.dataset.scrollOffset) || 0;
    const tel = qs(t);

    // element not it dom,
    // handled by router, possibly
    if (!tel) return;
    const ny = tel.offsetTop;
    const y = this.state.scroll.target;

    const delta = Math.abs(y - ny);

    // map the scroll delta to the scrollheight easing levels
    const m = map(delta, 0, corescroller.scrollHeight, 2, 6);
    const easing = `io${clamp(Math.round(m), 2, 6)}`;

    this.scrollToTween?.destroy();

    if (!snap) {
      this.scrollToTween = Tween({
        val: [y, ny + o],
        duration: m * 100,
        easing,
        update: ({ cur }) => {
          this.scrollTo({ y: cur });
        },
      });
    } else {
      this.snapTo({ y: ny + o });
    }
  }

  scrollTo({ x, y }) {
    if (Sniff.touchDevice) {
      window.scrollTo({
        left: x,
        top: y,
        behavior: "smooth",
      });
    } else {
      corescroller.setScroll({ x, y });
    }
  }

  snapTo({ x, y }) {
    if (Sniff.touchDevice) {
      window.scrollTo({
        left: x,
        top: y,
        behavior: "auto",
      });
    } else {
      corescroller.setScroll({ x, y });
      this.state.scroll.cur = y;
      this.state.scroll.target = y + DELTA; // small offset to bypass lerp threshold
    }
  }

  getIntersection({ top, bottom, y = this.state.scroll.target }) {
    const state = {
      progress: 0,
      visible: false,
    };
    if (y > top && y < bottom) {
      state.visible = true;
      state.progress = (y - top) / (bottom - top + corescroller.vh);
    }

    return state;
  }

  update(o = corescroller.state) {
    if (this.state.locked || Sniff.touchDevice) {
      return;
    }
    //   perform lerp
    const state = this.state;
    state.scroll.cur = o.y;

    // control pointer events when scrolling
    this.scrollCover.style.pointerEvents = this.lerp.delta > 1 ? "all" : "none";

    if (!this.lerp.needsUpdate()) return;

    this.lerp.update();

    for (const item of this.cache) {
      const y = round(state.scroll.target) * item.speed;
      const i = this.getIntersection({
        top: item.top,
        bottom: item.bottom,
        y,
      });
      item.visible = i.visible;
      item.progress = i.progress;
      this.render(item, y);
    }

    for (const fn of this.train) {
      fn.update(state, this.cache);
    }
  }

  render(item, y) {
    const s = item.dom.style;

    if (item.visible) {
      item.freeze = false;
      Object.assign(s, {
        transform: `translate3d(0, ${-y}px, 0)`,
        pointerEvents: `all`,
        opacity: 1,
      });
    } else {
      // if (el.id === "case-reel--wrapper") {
      //   console.log(hide, el.dataset);
      // }
      if (!item.hide) {
        Object.assign(s, {
          transform: `none`,
          pointerEvents: `none`,
          opacity: 0,
        });
      } else if (!item.freeze) {
        item.freeze = true;
        Object.assign(s, {
          transform: `translateY(${-y}px)`,
          pointerEvents: `none`,
          opacity: 0,
        });
      }
    }
  }

  lock() {
    this.state.locked = true;
    corescroller.lock();
  }

  unlock() {
    this.state.locked = false;
    corescroller.unlock();
  }
}

export const smooth = new Smooth({
  inertia: Sniff.touchDevice ? 0.125 : 0.075,
  dragSpeed: 3,
});

// window.smooth = smooth;
