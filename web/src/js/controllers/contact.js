import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { FormManager } from "../components/forms";
import { MobileForms } from "../components/forms/mobile";

import { iris, Sniff } from "../hermes";
import { smoothscroller } from "../scroller";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * 404 page controller
 *
 */

let undetail, forms;
export const contactController = new Controller({
  hide: ({ done }) => {
    undetail();
    forms.destroy();
    r0.destroy();
    monoShuffle.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    nav.setLinkActive("contact");

    undetail = iris.add("summary", "click", () => {
      setTimeout(smoothscroller.resize, 0);
    });

    if (Sniff.touchDevice) {
      forms = new MobileForms();
    } else {
      forms = new FormManager();
    }

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();
    monoShuffle.init();

    sail.in();
    done();
  },
});
