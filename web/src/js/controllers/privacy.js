import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";

import { Reveal } from "../reveal";

/**
 *
 * Privacy Prolicy page controller
 *
 */

let r0;
export const privacyController = new Controller({
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

    sail.in();
    done();
  },
});
