import { Duration, iris, qs, qsa, Sniff } from "../hermes";
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
    this.dom.style.display = "none";

    this.video = qs("#cta-picture video");
    this.video.load();
    this.video.pause();
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
      if (e.key === "Escape") this.close();
    });
  };

  unlisten = () => {
    this.unlistenClick();
    this.unlistenEsc();
  };

  open = async (panelId) => {
    if (!this.state.open) {
      if (this.timout) clearTimeout(this.timout);
      this.dom.style.display = "block";
      this.listen();
      this.state.open = true;

      this.state.current = qs(panelId, this.dom);

      this.preventOverscroll();

      if (!Sniff.touchDevice) {
        this.scroller = new Smooth({
          dom: this.state.current,
          isWindow: false,
          window: this.window,
        });
      }

      // allow display: none to take effect
      requestAnimationFrame(() => {
        this.dom.classList.add("active");
        this.state.current.classList.add("active");
      });

      if (panelId === "#cta-panel") {
        // play video
        this.video.currentTime = 0;
        if (this.video.paused) {
          await this.video.play();
        }

        this.requestDuration = new Duration({
          duration: 1500,
          complete: () => {
            this.video.pause();
          },
        });
      }
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

      if (this.requestDuration) {
        // play video
        this.requestDuration.destroy();
        this.video.play();
        this.requestDuration = null;
      }

      this.timout = setTimeout(() => {
        this.dom.style.display = "none";
      }, 1750);
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
