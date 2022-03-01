import { Athena } from "./athena";
import { Media } from "./media";
import { Plane } from "ogl";

import { ticker, bindAll, Tweens } from "../hermes";

class GL extends Athena {
  constructor() {
    super();

    this.media = [];

    this.createGeometry();

    ticker.add({
      update: this.update,
    });

    ro.add({
      update: this.resize,
    });

    this.resize();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      widthSegments: 8,
      heightSegments: 8,
    });
  }

  createMedia(img) {
    this.media.push(
      new Media({
        img,
        geometry: this.planeGeometry,
        gl: this.gl,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        planeDims: { w: window.innerWidth, h: window.innerHeight },
      })
    );
    this.update();
  }

  resize = ({ vw, vh } = { vw: window.innerWidth, vh: window.innerHeight }) => {
    super.resize();

    if (!this.media) return;

    this.media.forEach((media, i) => {
      media.planeDims = this.planeDims;
      media.resize({
        screen: this.screen,
        viewport: this.viewport,
      });
    });
  };

  update = () => {
    if (!this.media) return;

    this.media.forEach((media, i) => {
      media.update();
    });

    super.update();
  };
}

export const gl = new GL();
window.gl = gl;
