import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { FormManager } from "../components/forms";
import { MobileForms } from "../components/forms/mobile";

import { iris, qs, Sniff, Vau } from "../hermes";
import { smoothscroller, Parallax } from "../scroller";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";
import { FooterHover } from "../components/footer/footerHover";

/**
 *
 * 404 page controller
 *
 */

let undetail, forms, ph, fh, r0, r1;
export const contactController = new Controller({
  hide: ({ done }) => {
    undetail();
    forms.destroy();
    r0.destroy();
    r1.destroy();
    ph && ph.destroy();
    monoShuffle.destroy();
    fh && fh.destroy();

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
          start: 17,
          end: -17,
        },
        scale: { x: { start: 1.05 } },
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
      fh = new FooterHover({
        dom: qs("#contact-list"),
      });
    }

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();
    monoShuffle.init();

    r1 = new Reveal({
      targets: "#map-overlay--text",
      stagger: 75,
      auto: true,
      threshold: 0.99,
    });

    sail.in();
    done();
  },
});
