import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { Slider } from "../components/slider";

/**
 *
 * Career page controller
 *
 */

export const careerController = new Controller({
  hide: ({ done }) => {
    slider.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();
    nav.setLinkActive("careers");

    slider = new Slider();

    done();
  },
});
