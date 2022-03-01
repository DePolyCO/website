import { Controller } from "../hydra";

import { sail } from "../components/sails";

/**
 *
 * careerInner page controller
 *
 */

export const careerInnerController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();
    done();
  },
});
