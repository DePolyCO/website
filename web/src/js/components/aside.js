import { iris, qs, qsa } from "../hermes";
import { Smooth, smoothscroller } from "../scroller";

class AsideController {
  constructor() {
    this.dom = qs("#aside");
    // const scrollContent =
    this.scroller = new Smooth({
      dom: qs(".aside-panel", this.dom),
      isWindow: false,
      window: qs("#aside-inner", this.dom),
    });

    this.state = {
      open: false,
      current: null,
    };
  }

  init = () => {
    this.triggers = qsa("[data-trigger-aside]").map((item) => {
      iris.add(item, "click", () => {
        this.open(item.dataset.triggerAside);
      });
    });
  };

  test = () => {
    iris.add(document, "keydown", (e) => {
      if (e.key === "a" || e.key === "A") {
        if (this.state.open) {
          this.close();
        } else {
          this.open("#bio-panel");
        }
      }
    });
  };

  listen = () => {
    this.unlistenClick = iris.add(".aside-close", "click", this.close);
    this.unlistenEsc = iris.add(document, "keydown", (e) => {
      if (e.key === "Escape" && this.state.open) {
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

      this.scroller.init();
      this.scroller.resize();
      smoothscroller.lock("aside");

      this.state.current = qs(panelId, this.dom);

      this.dom.classList.add("active");
      this.state.current.classList.add("active");
    }
  };

  close = () => {
    if (this.state.open) {
      this.unlisten();
      this.state.open = false;
      smoothscroller.unlock("aside");

      this.dom.classList.remove("active");
      this.state.current.classList.remove("active");
    }
  };

  destroy = () => {
    this.untriggers.forEach((untrigger) => untrigger());
  };
}

export const asideController = new AsideController();
