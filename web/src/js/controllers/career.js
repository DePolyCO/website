import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { GallerySlider } from "../components/gallerySlider";
import { CaptureReveal } from "../components/captureReveal";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";
import { Sniff, Vau } from "../hermes";

/**
 *
 * Career page controller
 *
 */

let slider, capture;
export const careerController = new Controller({
  hide: ({ done }) => {
    slider.destroy();
    capture?.destroy();
    r0.destroy();
    monoShuffle.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    slider = new GallerySlider();

    new Vau({
      targets: "#hero-picture img",
      opacity: [0, 1],
      transform: {
        sx: [1.35, 1],
        sy: [1.35, 1],
      },
      duration: 1750,
      easing: "o6",
    });

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    if (Sniff.touchDevice) {
    } else {
      capture = new CaptureReveal({
        dom: "#quotes-list",
        targets: ".quote",
        revealTargets: ".quote-reveal",
        nestedTarget: true,
        revealOptions: {
          show: {
            from: 110,
            to: 0,
            stagger: 150,
            delay: 0,
            visible: true,
            easing: "o6",
            duration: 1750,
          },
          hide: {
            to: -110,
            stagger: 0,
            delay: 0,
            visible: false,
            easing: "o4",
            duration: 1250,
          },
        },
      });
    }

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();
    monoShuffle.init();
    nav.setLinkActive("careers");

    sail.in();
    done();
  },
});
