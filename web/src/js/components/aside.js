import { iris, qs, qsa, Sniff } from "../hermes";
import { Smooth, smoothscroller } from "../scroller";

class AsideController {
  constructor() {
    this.dom = qs("#aside");
    this.window = qs("#aside-inner", this.dom);

    this.state = {
      open: false,
      current: null,
    };

    this.scroller = false;

    // test
    // iris.add(document, "keydown", (e) => {
    //   if (e.key === "a") {
    //     this.open("#cta-panel");
    //   }
    // });
  }

  init = () => {
    this.untriggers = qsa("[data-trigger-aside]").map((item) => {
      const trigger = item.dataset.triggerAside;
      return iris.add(item, "click", () => this.open(trigger));
    });
  };

  listen = () => {
    this.unlistenClick = iris.add(".aside-close", "click", this.close);
    this.unlistenEsc = iris.add(document, "keydown", (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    });
  };

  unlisten = () => {
    this.unlistenClick();
    this.unlistenEsc();
  };

  open = (panelId) => {
    if (!this.state.open) {
      this.listen();
      this.state.open = true;

      this.state.current = qs(panelId, this.dom);

      this.preventOverscroll();
      if (Sniff.touchDevice) {
      } else {
        this.scroller = new Smooth({
          dom: this.state.current,
          isWindow: false,
          window: this.window,
        });
      }

      this.dom.classList.add("active");
      this.state.current.classList.add("active");
    }
  };

  close = () => {
    if (this.state.open) {
      this.unlisten();
      this.state.open = false;

      this.allowOverscroll();

      this.scroller && this.scroller.destroy();
      this.dom.classList.remove("active");
      this.state.current.classList.remove("active");
    }
  };

  preventOverscroll = () => {
    if (Sniff.touchDevice) {
      document.body.style.overflow = "hidden";
    } else {
      smoothscroller.lock("aside");
    }
  };

  allowOverscroll = () => {
    if (Sniff.touchDevice) {
      document.body.style.overflow = null;
    } else {
      smoothscroller.unlock("aside");
    }
  };

  destroy = () => {
    this.untriggers.forEach((untrigger) => untrigger());
    this.allowOverscroll();
  };
}

export const asideController = new AsideController();
