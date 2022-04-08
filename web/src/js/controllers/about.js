import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { CaptureReveal } from "../components/captureReveal";
import { nav } from "../components/nav";
import { monoShuffle } from "../components/monoShuffle";
import { Numbers } from "../components/revealNumbers";

import { qsa, Sniff, Vau } from "../hermes";
import { Reveal } from "../reveal";
import { Parallax } from "../scroller";

/**
 *
 * About page controller
 *
 */

let highlightFx, numbers, r0, ph, nrs;

export const aboutController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    numbers && numbers.destroy();
    nrs && nrs.destroy();
    r0.destroy();
    ph && ph.destroy();
    monoShuffle.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    new Vau({
      targets: "#hero-picture img",
      opacity: [0, 1],
      duration: 1750,
      easing: "o6",
    });

    if (!Sniff.touchDevice) {
      ph = new Parallax({
        dom: "#hero-picture img",
        speed: 1,
        down: true,
        useOnlyOffset: true,
        offset: {
          start: 17,
          end: -17,
        },
        scale: { x: { start: 1.05 } },
        easing: "linear",
      });
    }

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    if (Sniff.touchDevice) {
      numbers = new Numbers();
    } else {
      numbers = new CaptureReveal();
      new Reveal({
        targets: ".number-no",
        stagger: 75,
        auto: true,
      });
    }

    nav.setLinkActive("about");

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();

    monoShuffle.init();

    sail.in();
    done();
  },
});
