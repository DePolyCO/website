import { Controller } from "../hydra";

import { sail } from "../components/sails";

/**
 *
 * Home page controller
 *
 */

export const homeController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    done();
  },
});
