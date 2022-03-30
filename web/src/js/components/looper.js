import { iris, Observer, qs } from "../hermes";

export class Looper {
  constructor({ dom, intro, loop }) {
    this.dom = qs(dom);

    this.src = {
      intro,
      loop,
    };

    this.video = {
      intro: null,
      loop: null,
    };

    this.observer = Observer.create({
      callback: this.play,
    });
    this.observer.observe(this.dom);

    this.build();
  }

  build = () => {
    const frag = document.createDocumentFragment();

    this.video.intro = document.createElement("video");
    this.video.loop = document.createElement("video");

    const { intro, loop } = this.video;

    intro.width = 1800;
    intro.height = 1080;
    intro.muted = true;
    intro.autoplay = true;
    intro.playsinline = true;
    intro.preload = "auto";

    loop.width = 1800;
    loop.height = 1080;
    loop.muted = true;
    loop.autoplay = true;
    loop.playsinline = true;
    loop.preload = "auto";
    loop.loop = true;

    intro.src = this.src.intro;
    loop.src = this.src.loop;

    intro.classList.add("pa", "inset");
    loop.classList.add("pa", "inset");

    loop.style.opacity = 0;

    intro.pause();
    loop.pause();

    frag.appendChild(intro);
    frag.appendChild(loop);

    this.dom.appendChild(frag);
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
