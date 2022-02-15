import { Store } from "../../store";
import { select } from "./Dom";

// TODO
// Use Intersection?
export class LazyLoader {
  constructor() {}

  load(selector = `[data-lazy-src]:not(.media-ready)`) {
    this.els = select(selector);
    this.fetchAll();
  }

  async fetchAll() {
    this.els.forEach(this.fetchOne);
  }

  async fetchOne(el) {
    el.decoding = "async";

    if (Store[el.dataset.lazySrc]) {
      el = Store[el.dataset.lazySrc];
    } else {
      el.src = el.dataset.lazySrc;
      try {
        await el.decode();
        Store.images[el.src] = el;
      } catch (e) {}
    }
    el.classList.add("media-ready");
  }
}

export const lazyloader = new LazyLoader();
