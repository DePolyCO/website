import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { FormManager } from "../components/forms";

/**
 *
 * careerInner page controller
 *
 */

let forms;
export const careerInnerController = new Controller({
  hide: ({ done }) => {
    forms.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();
    forms = new FormManager();

    done();
  },
});
