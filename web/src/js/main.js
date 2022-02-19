import "./polyfills";

import { Hydra } from "./hydra";
import { iris, qsa } from "./hermes";
import { intro } from "./intro";

import { homeController } from "./controllers/home";
import { noController } from "./controllers/404";

import { Grid } from "./grid";
import { asideController } from "./components/aside";

// import { tracker } from "./nscroller/modular";
// import { corescroller } from "./nscroller/core";
import { smoothscroller } from "./scroller";
import { footer } from "./components/footer";

/**
 *
 * Instantiate
 * router
 *
 *
 */

new Hydra({
  loader: async (done) => {
    await intro.init();
    done();
  },
  controllers: {
    home: homeController,
    404: noController,
  },
});

iris.add(
  window,
  "load",
  () => {
    console.log("Design by: FiftySeven® — https://fiftyseven.co/");
    console.log("Dev by: Siddharth S. — https://siddharthsham.com");

    new Grid({
      cols: 4,
    });
    asideController.test();

    // window.corescroller = corescroller;
    window.smooth = smoothscroller;
    window.footer = footer;
    footer.init();
    // smoothscroller.resize();

    if (
      "serviceWorker" in navigator &&
      window.location.hostname !== "localhost"
    ) {
      navigator.serviceWorker.register("/sw.js");
    }
  },
  {
    once: true,
  }
);
