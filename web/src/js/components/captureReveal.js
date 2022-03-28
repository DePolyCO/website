import { qs, qsa, iris } from "../hermes";
import { Reveal } from "../reveal";

export class CaptureReveal {
  constructor({
    dom = "#numbers-content",
    targets = ".number-item",
    revealTargets = ".number-detail",
    nestedTarget = false,
    revealOptions = {
      show: {
        from: 110,
        to: 0,
        stagger: 75,
        delay: 250,
        visible: true,
        easing: "o6",
        duration: 1750,
      },
      hide: {
        from: 0,
        to: -110,
        stagger: 0,
        delay: 0,
        visible: false,
        easing: "o6",
        duration: 1250,
      },
    },
  } = {}) {
    this.dom = qs(dom);
    this.targets = qsa(targets, this.dom);
    this.revealTargetsString = revealTargets;
    this.nestedTarget = nestedTarget;
    this.revealTargets = qsa(revealTargets, this.dom);
    this.revealOptions = revealOptions;
    this.current = 0;

    this.build();
    this.listen();

    window.r = this;
  }

  build = () => {
    this.reveals = this.targets.map(
      (item, i) =>
        new Reveal({
          targets: this.nestedTarget
            ? qsa(this.revealTargetsString, item)
            : this.revealTargets[i],
          stagger: 50,
          delay: 150,
          auto: i === 0,
          autoCallback:
            i === 0
              ? () => {
                  this.reveals[0].observer.disconnect();
                  this.reveals[0].play({ to: 0 });
                }
              : false,
        })
    );

    this.targets[this.current].classList.add("active");
  };

  listen = () => {
    this.unlisteners = this.targets.map((item, i) =>
      iris.add(item, "click", () => {
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
      r.play(this.revealOptions.show);
    } else {
      r.playTo(this.revealOptions.show);
    }
    this.current = i;
  };

  setInactive = (i = this.current) => {
    this.targets[i].classList.remove("active");
    this.reveals[i].playTo(this.revealOptions.hide);
  };

  destroy = () => {
    this.reveals.forEach((reveal) => reveal.destroy());
    this.unlisteners.forEach((unlisten) => unlisten());
  };
}
