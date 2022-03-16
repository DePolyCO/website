import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { CaptureReveal } from "../components/captureReveal";
import { nav } from "../components/nav";
import { monoShuffle } from "../components/monoShuffle";
import { Numbers } from "../components/revealNumbers";

import { qsa, Sniff, Vau } from "../hermes";
import { Reveal } from "../reveal";

/**
 *
 * About page controller
 *
 */

let highlightFx, numbers, r0;

export const aboutController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    // numbers.destroy();
    r0.destroy();
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
      transform: {
        sx: [1.35, 1],
        sy: [1.35, 1],
      },
      duration: 1750,
      easing: "o6",
    });

    if (Sniff.mobile) {
      numbers = new Numbers();
    } else {
      numbers = new CaptureReveal();
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
