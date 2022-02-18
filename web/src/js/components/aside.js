import { iris, qs } from "../hermes";
// import { scroller } from "../scroller";

class AsideController {
  constructor() {
    this.dom = qs("#aside");

    this.state = {
      open: false,
      current: null,
    };
  }

  test = () => {
    iris.add(document, "keydown", (e) => {
      if (e.key === "a" || e.key === "A") {
        if (this.state.open) {
          this.close();
        } else {
          this.open("#test-panel");
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
      // scroller.lock();

      this.state.current = qs(panelId);

      this.dom.classList.add("active");
      this.state.current.classList.add("active");
    }
  };

  close = () => {
    if (this.state.open) {
      this.unlisten();
      this.state.open = false;
      // scroller.unlock();

      this.dom.classList.remove("active");
      this.state.current.classList.remove("active");
    }
  };
}

export const asideController = new AsideController();
