import { Controller } from "../hydra";

import { sail } from "../components/sails";

/**
 *
 * 404 page controller
 *
 */

export const careerController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();
    done();
  },
});
