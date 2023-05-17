import { ImageLoader, Vau } from "../hermes";
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

  /** @type {boolean} */
  destroyed = false;

  /**
   * @param {object} options
   * @param {HTMLElement} options.dom
   */
  constructor({ dom }) {
    this.$dom = dom;
    this.$parent = this.$dom.parentElement;
    this.$scrollable = this.$dom.querySelector('.banner__highlights');

    this.isMobile = !MediaQueryListener.matches('(min-width: 850px)');
    this.type = this.$dom.getAttribute('data-banner-type');

    this.initialize();
  }

  initialize = () => {
    if (this.isMobile) {
      this.$dom.setAttribute('data-mobile', '');
    }

    this.preloadImages()
      .finally(() => {
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
            { immediate: false },
          ],
        ]);
      });
  }

  preloadImages = async () => {
    const images = Array.from(this.$dom.querySelectorAll('img')).map((img) => (
      img.getAttribute('src')
    ));

    return new Promise((resolve) => {
      ImageLoader({
        arr: images,
        complete: resolve
      });
    });
  }

  destroy = () => {
    this.mediaQueryListener.destroy();
    if (this.$parent instanceof HTMLElement) {
      this.$parent.removeChild(this.$dom);
    }

    this.$dom = null;
    this.$parent = null;
    this.$scrollable = null;
    this.destroyed = true;
  };

  bindEvents = () => {
    const close = this.$dom.querySelector("[data-banner-close]");
    close.addEventListener("click", this.hide.bind(this, { destroy: true }), { once: true });
  };

  show = () => {
    if (this.destroyed) {
      return;
    }

    const rect = this.$dom.getBoundingClientRect();
    const yStart = rect.height / window.innerWidth * 100 * -1;
    const yEnd = this.isMobile ? 24 : 8;

    this.$dom.style.visibility = '';
    this.$dom.style.transform = `translateY(${yStart}vw)`;

    new Vau({
      targets: this.$dom,
      transform: {
        y: [yStart, yEnd],
        yu: "vw",
      },
      delay: !this.isMobile ? 1200 : 800,
      duration: 2500,
      easing: "o6",
      complete: () => {
        if (this.type !== 'image' || !this.isMobile) {
          return;
        }

        if (this.$scrollable.scrollWidth > this.$scrollable.offsetWidth) {
          const animationDuration = this.$scrollable.scrollWidth / this.$scrollable.offsetWidth * 1.5;
          const animationDistance = this.$scrollable.scrollWidth - this.$scrollable.offsetWidth;

          this.$dom.style.setProperty('--banner-callout-animation-duration', `${animationDuration}s`);
          this.$dom.style.setProperty('--banner-callout-animation-distance', `${animationDistance * -1}px`);
          this.$scrollable.firstElementChild.classList.add('animate--banner-callout');
        }
      }
    });
  };

  hide = ({ destroy } = { destroy: false }) => {
    if (this.destroyed) {
      return;
    }

    const rect = this.$dom.getBoundingClientRect();
    const yStart = this.isMobile ? 24 : 8;
    const yEnd = rect.height / window.innerWidth * 100 * -1;

    new Vau({
      targets: this.$dom,
      transform: {
        y: [yStart, yEnd],
        yu: "vw",
      },
      duration: 800,
      easing: "io2",
      complete: () => {
        if (destroy) {
          this.destroy();
        }
      }
    });
  };

}

export default Banner;
