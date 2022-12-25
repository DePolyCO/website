import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { iris, qs, qsa, Sniff, Vau } from "../hermes";
import { Engine } from "../components/blogEngine";

function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}


const tplSearchDesktop = `
<div id="search-extended" class="search-field df aic pr fv-mono pen">
    <svg id="search-extended--btn" class="pea z1 cp">
        <use xlink:href="#search-icon"></use>
    </svg>
    <input class="pea" id="search-extended--input" type="text" placeholder="Search" enterKeyHint="search">
    <button id="search-extended--close" class="filters-extended--btn df jcc aic pea z1 vh">
        <svg class="pen" viewBox="0 0 9 4">
            <use xlink:href="#cross-icon"></use>
        </svg>
    </button>
</div>
`;

const tplSearchMobile = `
<div id="search-extended" class="search-field df pr fv-mono pen">
    <input class="pea" id="search-extended--input" type="text" placeholder="Search" enterKeyHint="search">
    <svg id="search-extended--btn" class="pa left top pea z1 cp">
        <use xlink:href="#search-icon"></use>
    </svg>
    <svg id="search-extended--close" class="pa right top pea z1 d-hide">
        <use xlink:href="#cross-icon"></use>
    </svg>
</div>
`;


/**
 *
 * Blog Prolicy page controller
 *
 */

let ficl, s1;
export const blogController = new Controller({
  hide: ({ done }) => {
    ficl && ficl();
    s1.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    nav.setLinkActive("news");

    const el = qs('#blog-filters--extended');
    el.prepend(fragmentFromString(
      Sniff.touchDevice ? tplSearchMobile : tplSearchDesktop
    ));

    new Vau({
      targets: qsa(".article-animate"),
      opacity: [0, 1],
      easing: "o6",
      duration: 1000,
    });

    qsa(".article-card")
      .slice(0, 3)
      .map(
        (item, i) =>
          new Vau({
            targets: item,
            transform: {
              y: [60, 0],
            },
            opacity: [0, 1],
            easing: "o6",
            duration: 1750,
            delay: i * 100,
          })
      );

    const fi = qs("#filters-extended");
    const btn = qs("#filters-extended--btn");
    ficl = iris.add(btn, "click", (e) => {
      fi.classList.toggle("active");
      btn.classList.toggle("active");
    });

    s1 = new Engine();

    sail.in();
    done();
  },
});
