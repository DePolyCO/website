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

import { Looper } from "../components/looper";

/**
 *
 * Tech page controller
 *
 */

let highlightFx, compares, ps, r0, pt, ph, l0;
export const techController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    compares.forEach((compare) => compare.destroy());
    ps && ps.forEach((p) => p.destroy());
    pt && pt.destroy();
    ph && ph.destroy();
    r0.destroy();
    l0.destroy();
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
      duration: 1750,
      easing: "o6",
    });

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    if (!Sniff.touchDevice) {
      ph = new Parallax({
        dom: "#hero-picture img",
        speed: 1,
        down: true,
        useOnlyOffset: true,
        offset: {
          start: 20,
          end: -20,
        },
        scale: { x: { start: 1.1 } },
        easing: "linear",
      });
    }

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

    l0 = new Looper({
      dom: "#magic-visual",
      intro: "/static/technology/liquid/intro.mp4",
      loop: "/static/technology/liquid/loop.mp4",
    });

    monoShuffle.init();
    sail.in();
    done();
  },
});
