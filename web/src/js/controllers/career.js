import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { GallerySlider } from "../components/gallerySlider";
import { CaptureQuotes } from "../components/captureQuotes";

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
    sail.out(done);
  },

  show: ({ done }) => {
    nav.setLinkActive("careers");

    slider = new GallerySlider();
    capture = new CaptureQuotes();

    sail.in();
    done();
  },
});
