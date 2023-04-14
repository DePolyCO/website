import { Vau } from "../hermes";
import MediaQueryListener from "./mediaQueryListener";

class Banner {
  /** @type {HTMLElement} */
  dom = null;

  /** @type {HTMLElement} */
  parent = null;

  /** @type {HTMLElement} */
  main = null;

  /**
   * @param {object} options
   * @param {HTMLElement} options.dom
   */
  constructor({ dom }) {
    this.dom = dom;
    this.parent = this.dom.parentElement;
    this.isMobile = false;
    
    this.bindEvents();

    this.mediaQueryListener = new MediaQueryListener([
      [
        "(min-width: 850px)",
        (/** @type {MediaQueryListEvent} */ e) => {
          this.isMobile = !e.matches;

          if (e.matches) {
            this.dom.removeAttribute('data-mobile');
          }
          else {
            this.dom.setAttribute('data-mobile', '');
          }

          this.show();
        },
        { immediate: true },
      ],
    ]);
  }

  destroy = () => {
    this.mediaQueryListener.destroy();
    if (this.parent instanceof HTMLElement) {
      this.parent.removeChild(this.dom);
    }

    this.dom = null;
    this.parent = null;
  };

  bindEvents = () => {
    const close = this.dom.querySelector("[data-banner-close]");
    close.addEventListener("click", this.close, { once: true });
  };

  show = () => {
    const yPos = this.isMobile ? -100 : 100;
    this.dom.style.visibility = '';
    this.dom.firstElementChild.style.transform = `translateY(${yPos}%)`;

    new Vau({
      targets: this.dom.firstElementChild,
      transform: {
        y: [
          this.isMobile ? -100 : 100,
          0
        ],
        yu: "%",
      },
      delay: 1600,
      duration: 1000,
      easing: "o2",
    });
  };

  close = () => {
    new Vau({
      targets: this.dom.firstElementChild,
      transform: {
        y: [
          0,
          this.isMobile ? -100 : 100
        ],
        yu: "%",
      },
      duration: 800,
      easing: "io2",
      complete: () => {
        this.destroy();
      },
    });
  };
}

export default Banner;
