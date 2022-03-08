import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";

/**
 *
 * Privacy Prolicy page controller
 *
 */

export const privacyController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    nav.unsetLinkActive();
    sail.in();
    done();
  },
});
