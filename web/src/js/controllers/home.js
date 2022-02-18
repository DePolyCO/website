import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { iris, qs } from "../hermes";
import { TextHighlight } from "../components/textHighlight";

/**
 *
 * Home page controller
 *
 */

export const homeController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    const el = qs(".text-underlay");

    iris.add(document, "keydown", (e) => {
      if (e.key === "t") {
        el.classList.toggle("text-underlay--active");
      }
    });

    window.highlight = new TextHighlight({
      targets: "[data-text-highlight]",
    });

    done();
  },
});
