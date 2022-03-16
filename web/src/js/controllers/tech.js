import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { Compare } from "../components/compare";
import { nav } from "../components/nav";

import { qs, qsa, Sniff, Vau } from "../hermes";
import { Parallax } from "../scroller";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";
import { fx } from "../components/fxmanager";

/**
 *
 * Tech page controller
 *
 */

let highlightFx, compares, ps, r0, pt;
export const techController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    compares.forEach((compare) => compare.destroy());
    ps && ps.forEach((p) => p.destroy());
    pt && pt.destroy();
    r0.destroy();
    fx.remove(".explain-visual--circle");

    monoShuffle.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();

    new Vau({
      targets: "#hero-picture img",
      opacity: [0, 1],
      transform: {
        sx: [1.35, 1],
        sy: [1.35, 1],
      },
      duration: 1750,
      easing: "o6",
    });

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    const highlights = qsa("[data-text-highlight");
    highlightFx = new TextHighlight({
      targets: highlights,
    });

    compares = qsa("[data-compare-slider").map(
      (item) => new Compare({ dom: item })
    );

    if (!Sniff.touchDevice) {
      ps = qsa(".explain-item").map(
        (item) => new Parallax({ dom: item, ease: "io2" })
      );

      pt = new Parallax({ dom: qs("#magic-content--inner"), ease: "io2" });
    }

    nav.setLinkActive("technology");

    fx.add(".explain-visual--circle");

    monoShuffle.init();
    sail.in();
    done();
  },
});
