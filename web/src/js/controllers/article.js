import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";

import { Reveal } from "../reveal";
import { Vau } from "../hermes";

/**
 *
 * Article Prolicy page controller
 *
 */

let r0;
export const articleController = new Controller({
  hide: ({ done }) => {
    r0.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    nav.unsetLinkActive();

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

    sail.in();
    done();
  },
});
