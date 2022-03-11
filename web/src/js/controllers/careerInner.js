import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { FormManager } from "../components/forms";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * careerInner page controller
 *
 */

let forms, r0;
export const careerInnerController = new Controller({
  hide: ({ done }) => {
    forms.destroy();
    r0.destroy();
    monoShuffle.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    forms = new FormManager();

    r0 = new Reveal({
      targets: ".hero-title",
      stagger: 150,
    });
    r0.play();

    monoShuffle.init();

    sail.in();
    done();
  },
});
