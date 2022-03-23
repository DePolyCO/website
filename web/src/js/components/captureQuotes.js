import { qs, qsa, iris } from "../hermes";
import { Reveal } from "../reveal";


// NOTE: NOt used
// Look at capture Reveal isntead
export class CaptureQuotes {
  constructor() {
    this.dom = qs("#quotes-list");
    this.targets = qsa(".quote", this.dom);

    this.current = 0;

    this.init();
    this.listen();

    this.setActive(0);
  }

  init = () => {
    this.reveals = this.targets.map(
      (item) =>
        new Reveal({
          targets: qsa(".quote-reveal", item),
          stagger: 50,
          delay: 150,
        })
    );
  };

  listen = () => {
    this.unlisteners = this.targets.map((target, i) =>
      iris.add(target, "click", () => {
        console.log(i, this.current);
        if (i === this.current) return;
        this.setActive(i);
      })
    );
  };

  setActive = (i) => {
    this.setInactive(this.current);

    this.targets[i].classList.add("active");

    // handle reveal
    const r = this.reveals[i];
    const t = r.tween.train;
    if (t.length && t[0].anim.tweens.progress > 0.25) {
      r.play({
        from: 110,
        to: 0,
        stagger: 150,
        delay: 0,
        visible: true,
        easing: "o6",
        duration: 1750,
      });
    } else {
      r.playTo({
        to: 0,
        stagger: 150,
        delay: 0,
        visible: true,
        easing: "o6",
        duration: 1750,
      });
    }

    this.current = i;
  };

  setInactive = (i = this.current) => {
    this.targets[i].classList.remove("active");
    this.reveals[i].playTo({
      to: -110,
      stagger: 0,
      delay: 0,
      visible: false,
      easing: "o4",
      duration: 1250,
    });
  };

  destroy = () => {
    this.reveals.forEach((reveal) => reveal.destroy());
    this.unlisteners.forEach((unlisten) => unlisten());
  };
}
