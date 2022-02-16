import "./polyfills";

import { Hydra } from "./hydra";
import { iris } from "./hermes";
import { intro } from "./intro";

import { homeController } from "./controllers/home";
import { noController } from "./controllers/404";

import { Grid } from "./grid";

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
    console.log("Site by: Siddharth — https://siddharthsham.com");

    new Grid({
      cols: 4,
    });

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
