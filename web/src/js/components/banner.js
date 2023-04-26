import { Vau, ticker } from "../hermes";
import MediaQueryListener from "./mediaQueryListener";

class Banner {
  /** @type {HTMLElement} */
  $dom = null;

  /** @type {HTMLElement} */
  $parent = null;

  /** @type {HTMLElement} */
  $scrollable = null;

  /** @type {'text'|'image'} */
  type = null;

  /**
   * @param {object} options
   * @param {HTMLElement} options.dom
   */
  constructor({ dom }) {
    this.$dom = dom;
    this.$parent = this.$dom.parentElement;
    this.$scrollable = this.$dom.querySelector('.banner__highlights');

    this.isMobile = false;
    this.type = this.$dom.getAttribute('data-banner-type');

    this.bindEvents();

    this.mediaQueryListener = new MediaQueryListener([
      [
        "(min-width: 850px)",
        (/** @type {MediaQueryListEvent} */ e) => {
          this.isMobile = !e.matches;

          this.$scrollable.firstElementChild.classList.remove('animate--banner-callout');

          if (e.matches) {
            this.$dom.removeAttribute('data-mobile');
          }
          else {
            this.$dom.setAttribute('data-mobile', '');
          }

          this.show();
        },
        { immediate: true },
      ],
    ]);
  }

  destroy = () => {
    this.mediaQueryListener.destroy();
    if (this.$parent instanceof HTMLElement) {
      this.$parent.removeChild(this.$dom);
    }

    this.$dom = null;
    this.$parent = null;
    this.$scrollable = null;
  };

  bindEvents = () => {
    const close = this.$dom.querySelector("[data-banner-close]");
    close.addEventListener("click", this.close, { once: true });
  };

  show = () => {
    const yPos = this.isMobile ? -110 : 110;
    const animationDuration = this.$scrollable.scrollWidth / this.$scrollable.offsetWidth * 1.5;

    this.$dom.style.visibility = '';
    this.$dom.firstElementChild.style.transform = `translateY(${yPos}%)`;
    this.$dom.style.setProperty('--banner-callout-animation-duration', `${animationDuration}s`);

    new Vau({
      targets: this.$dom.firstElementChild,
      transform: {
        y: [yPos, 0],
        yu: "%",
      },
      delay: 1200,
      duration: 1000,
      easing: "o2",
      complete: () => {
        if (this.type !== 'image' || !this.isMobile) {
          return;
        }

        if (this.$scrollable.scrollWidth > this.$scrollable.offsetWidth) {
          this.$scrollable.firstElementChild.classList.add('animate--banner-callout');
        }
      }
    });
  };

  close = () => {
    new Vau({
      targets: this.$dom.firstElementChild,
      transform: {
        y: [
          0,
          this.isMobile ? -110 : 110
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