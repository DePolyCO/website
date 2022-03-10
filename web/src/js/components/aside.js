import { iris, qs, qsa } from "../hermes";
import { Smooth, smoothscroller } from "../scroller";

class AsideController {
  constructor() {
    this.dom = qs("#aside");
    this.window = qs("#aside-inner", this.dom);

    this.state = {
      open: false,
      current: null,
    };

    // test
    iris.add(document, "keydown", (e) => {
      if (e.key === "a") {
        this.open("#cta-panel");
      }
    });
  }

  init = () => {
    this.untriggers = qsa("[data-trigger-aside]").map((item) => {
      return iris.add(item, "click", () => {
        this.open(item.dataset.triggerAside);
      });
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

      smoothscroller.lock("aside");

      this.state.current = qs(panelId, this.dom);

      this.scroller = new Smooth({
        dom: this.state.current,
        isWindow: false,
        window: this.window,
      });

      this.dom.classList.add("active");
      this.state.current.classList.add("active");
    }
  };

  close = () => {
    if (this.state.open) {
      this.unlisten();
      this.state.open = false;
      smoothscroller.unlock("aside");

      this.scroller.destroy();
      this.dom.classList.remove("active");
      this.state.current.classList.remove("active");
    }
  };

  destroy = () => {
    this.untriggers.forEach((untrigger) => untrigger());
    smoothscroller.unlock("aside");
  };
}

export const asideController = new AsideController();
