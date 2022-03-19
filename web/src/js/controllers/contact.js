import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { FormManager } from "../components/forms";
import { MobileForms } from "../components/forms/mobile";

import { iris, Sniff, Vau } from "../hermes";
import { smoothscroller, Parallax } from "../scroller";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * 404 page controller
 *
 */

let undetail, forms, ph;
export const contactController = new Controller({
  hide: ({ done }) => {
    undetail();
    forms.destroy();
    r0.destroy();
    ph && ph.destroy();
    monoShuffle.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    nav.setLinkActive("contact");

    undetail = iris.add("summary", "click", () => {
      setTimeout(smoothscroller.resize, 0);
    });

    new Vau({
      targets: "#hero-picture img",
      opacity: [0, 1],
      duration: 1750,
      easing: "o6",
    });

    if (!Sniff.touchDevice) {
      ph = new Parallax({
        dom: "#hero-picture img",
        speed: 1,
        down: true,
        useOnlyOffset: true,
        offset: {
          start: 20,
          end: -20,
        },
        scale: { x: { start: 1.1 } },
        easing: "linear",
      });
    }

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
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
