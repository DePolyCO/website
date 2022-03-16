import { Timeline, qs, Sniff, Vau, ticker } from "../../hermes";
import { smoothscroller } from "../../scroller";

class Sail {
  constructor() {
    this.sail = qs("#sail");
    this.app = qs("#app");

    this.init();
  }

  init() {
    if (Sniff.mobile) {
      this.in = this.inM;
      this.out = this.outM;
    } else {
      this.in = this.inD;
      this.out = this.outD;
    }
  }

  inD() {
    this.tl?.do("destroy");
    this.tl = new Timeline();
    // ticker.pause();
    this.tl.add({
      targets: this.app,
      transform: {
        y: [150, 0],
      },
      duration: 1750,
      easing: "o4",
    });
    this.sail.style.opacity = 0;
    // this.tl.add({
    //   targets: this.sail,
    //   opacity: [1, 0],
    //   duration: 50,
    //   easing: "o3",
    // });
  }

  outD(done = false) {
    // this.tl.do("reverse", { complete: done });

    this.tl = new Timeline();
    this.sail.style.transform = `translateY(100%)`;
    this.sail.style.opacity = 1;
    this.tl.add({
      targets: this.app,
      transform: {
        y: [0, -150],
      },
      duration: 1000,
      easing: "i4",
    });
    this.tl.add({
      targets: this.sail,
      transform: {
        y: [100, 0],
        yu: "%",
      },
      duration: 1000,
      easing: "i4",
      complete: done,
    });
  }

  inM() {
    this.tl = new Vau({
      targets: this.sail,
      easing: "o3",
      opacity: [1, 0],
      duration: 200,
      complete: () => {
        this.sail.style.pointerEvents = `none`;
      },
    });
  }

  outM(done) {
    this.sail.style.pointerEvents = `all`;
    this.tl = new Vau({
      targets: this.sail,
      easing: "o3",
      opacity: [0, 1],
      duration: 50,
      complete: done,
    });
    // this.tl.reverse({ complete: done });
  }
}

export const sail = new Sail();
