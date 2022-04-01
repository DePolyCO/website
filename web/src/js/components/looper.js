import { iris, Observer, qs } from "../hermes";

export class Looper {
  constructor({ dom, intro, loop }) {
    this.dom = qs(dom);

    this.video = {
      intro: qs("#visual-intro", this.dom),
      loop: qs("#visual-loop", this.dom),
    };

    // check support
    const support = this.video.intro.canPlayType('video/webm; codecs="vp9"');
    // empty string is retruned for failure
    if (!support.length) {
      this.video.intro.remove();
      this.video.loop.remove();
      return;
    } else {
      qs("#visual-poster", this.dom).remove();
    }

    this.src = {
      intro,
      loop,
    };

    this.observer = Observer.create({
      callback: this.play,
    });
    this.observer.observe(this.dom);

    this.build();
  }

  build = () => {
    const { intro, loop } = this.video;

    loop.style.opacity = 0;

    intro.pause();
    loop.pause();
  };

  play = (node, isIntersecting) => {
    if (isIntersecting) {
      const { intro } = this.video;
      intro.play();

      this.unEnd = iris.add(intro, "ended", this.introEnded);

      this.observer.disconnect();
      this.observer = null;
    }
  };

  introEnded = () => {
    this.video.intro.style.opacity = 0;

    this.video.loop.style.opacity = 1;
    this.video.loop.play();

    this.destroy();
  };

  destroy = () => {
    this.unEnd && this.unEnd();
    this.observer && this.observer.disconnect();
  };
}
