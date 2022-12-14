import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { FormManager } from "../components/forms";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";
import { Vau } from "../hermes";

/**
 *
 * careerInner page controller
 *
 */

let forms, r0, r1;
export const careerInnerController = new Controller({
  hide: ({ done }) => {
    forms.destroy();
    r0.destroy();
    r1.destroy();
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

    monoShuffle.init();

    sail.in();
    done();
  },
});
