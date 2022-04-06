import { iris, qs, qsa } from "../hermes";
import { Reveal } from "../reveal";

export class Numbers {
  constructor() {
    this.dom = qs("#numbers-m");
    this.nos = qsa(".number-m--no", this.dom);
    this.slides = qsa(".number-m--detail", this.dom);
    this.current = 0;

    this.init();
  }

  init = () => {
    this.build();
    this.listen();

    this.active(0);
  };

  build = () => {
    this.reveals = this.slides.map(
      (el) => new Reveal({ targets: el, stagger: 75 })
    );
    this.reveals.forEach((r) => {
      r.play({
        from: 0,
        to: -110,
        visible: false,
        delay: 0,
        stagger: 0,
        duration: 1,
      });
    });
  };

  listen = () => {
    this.unlisteners = this.nos.map((el, i) => {
      return iris.add(el, "click", () => {
        if (i === this.current) return;
        this.active(i);
      });
    });
  };

  active = (i) => {
    this.inactive(this.current);

    this.nos[i].classList.add("active");
    this.reveals[i].play({
      from: 100,
      to: 0,
      visible: true,
      delay: 250,
      stagger: 75,
      duration: 1750,
    });

    this.current = i;
  };

  inactive = (i) => {
    this.nos[i].classList.remove("active");
    this.reveals[i].playTo({
      to: -110,
      visible: false,
      delay: 0,
      stagger: 0,
      duration: 1250,
    });
  };

  destroy = () => {
    this.unlisteners.forEach((u) => u());
    this.reveals.forEach((r) => r.destroy());
  };
}
