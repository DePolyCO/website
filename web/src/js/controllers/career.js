import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { GallerySlider } from "../components/gallerySlider";
import { CaptureQuotes } from "../components/captureQuotes";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * Career page controller
 *
 */

let slider, capture;
export const careerController = new Controller({
  hide: ({ done }) => {
    slider.destroy();
    capture.destroy();
    r0.destroy();
    monoShuffle.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    nav.setLinkActive("careers");

    slider = new GallerySlider();
    capture = new CaptureQuotes();

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
