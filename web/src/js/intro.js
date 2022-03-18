import { ImageLoader, qs, qsa, Vau, unique, Duration } from "./hermes";
import { assets } from "./preload";
export class Intro {
  constructor({ begin = () => {}, update, complete = () => {} } = {}) {
    Object.assign(this, { begin, update, complete });
  }

  async init(bucketKey) {
    // complete preloading
    // and intro loader animation
    await Promise.all([
      this.begin(),
      await Promise.all([this.images(), this.fonts(), this.videos()]),
    ]);
    // complete outro load animation
    await this.complete();
  }

  async fonts() {
    if ("fonts" in document) {
      await Promise.all(
        assets.fonts.map((font) => document.fonts.load(`1em ${font}`))
      );
    }
  }

  images() {
    // preload cover images

    // const preload = qs("#img-preload");
    // const urls = qsa("img", preload).map((el) => el.dataset.lazySrc);
    // const uniqueUrls = urls.filter(unique);
    // assets.essential.push(...uniqueUrls);

    return new Promise((resolve) => {
      ImageLoader({
        arr: assets.essential,
        update: (img, i, progress) => {
          this.update && this.update(progress);
        },
        complete: () => {
          resolve();
          // preload.remove();
        },
      });
    });
  }

  async videos() {}
}

/*
 *
 * Setup Intro here
 * ----------------
 *
 */

const loadEl = qs("#loader");
// const loadProgress = qs("#loader-percent");
// const appWrapper = qs("#app-wrapper");

export const intro = new Intro({
  complete: async () => {
    new Vau({
      targets: loadEl,
      duration: 400,
      easing: "o3",
      opacity: [1, 0],
      complete: () => loadEl.remove(),
    });

    // appWrapper.style.transform = `translateY(${window.innerHeight}px)`;

    // new Vau({
    //   targets: "[data-scroll-content]",
    //   duration: 1250,
    //   delay: 900,
    //   easing: "o6",
    //   transform: {
    //     y: [window.innerHeight, 0],
    //   },
    // });

    await new Promise(
      (resolve) =>
        new Duration({
          duration: 400,
          complete: resolve,
        })
    );
  },
});
