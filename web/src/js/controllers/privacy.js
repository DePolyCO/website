import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";

import { Reveal } from "../reveal";
import { Vau } from "../hermes";

/**
 *
 * Privacy Prolicy page controller
 *
 */

let r0, r1;
export const privacyController = new Controller({
  hide: ({ done }) => {
    r0.destroy();
    r1.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    nav.unsetLinkActive();

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();

    r1 = new Reveal({
      targets: ".text-block--text",
      stagger: 75,
    });
    r1.play();

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    sail.in();
    done();
  },
});
