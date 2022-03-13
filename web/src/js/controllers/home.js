import { Controller } from "../hydra";

import { Draw, Observer, qsa, Sniff } from "../hermes";

import { Parallax } from "../scroller";
import { Reveal } from "../reveal";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { Collapse } from "../components/collapse";
import { nav } from "../components/nav";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * Home page controller
 *
 */

let highlightFx, p1, p2, p3, p4, c1, ps, iconDraws, o, r0, rst;
export const homeController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    if (!Sniff.touchDevice) {
      c1.destroy();
      ps.forEach((p) => p.destroy());
    }

    p1.destroy();
    p2.destroy();
    p3.destroy();
    p4.destroy();

    r0.destroy();
    rst.destroy();
    o.disconnect();
    iconDraws.forEach((d) => d.destroy());
    monoShuffle.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    highlightFx = new TextHighlight({
      targets: "[data-text-highlight",
    });

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });

    r0.play();

    rst = new Reveal({
      targets: ".stat-title",
      auto: true,
      char: true,
      stagger: 35,
      threshold: Sniff.touchDevice ? 0.5 : 1,
    });

    const prlx = qsa("[data-parallax]");

    p1 = new Parallax({
      dom: prlx[0],
      speed: 0.1,
    });
    p2 = new Parallax({
      dom: prlx[1],
      speed: 0.2,
      down: true,
    });
    p3 = new Parallax({
      dom: prlx[2],
      speed: 0.5,
    });
    p4 = new Parallax({
      dom: prlx[3],
      down: true,
      speed: 0.75,
    });

    if (!Sniff.touchDevice) {
      c1 = new Collapse();

      ps = qsa(".stat-desc").map(
        (item) =>
          new Parallax({
            dom: item,
            ease: "io2",
            limitBounds: true,
            speed: 2,
          })
      );
    }

    nav.setLinkActive("home");

    const icons = qsa(".icon");
    iconDraws = icons.map((el) =>
      Draw({
        targets: el,
        duration: 1750,
        easing: Sniff.safari ? "i2" : "o6",
        invert: Sniff.safari,
        reverse: Sniff.safari,
      })
    );
    iconDraws.forEach((d) => d.pause());

    o = Observer().create({
      callback: (node, isIntersecting, unobserve) => {
        if (isIntersecting) {
          for (let i = 0, n = icons.length; i < n; i++) {
            const el = icons[i];
            if (node === el) {
              iconDraws[i].play();
              unobserve(node);
              break;
            }
          }
        }
      },
      threshold: 1,
    });

    o.observe(icons);

    monoShuffle.init();

    sail.in();
    done();
  },
});
