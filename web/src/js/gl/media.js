import { Mesh, Program, Texture } from "ogl";

import { fragment } from "./shaders/fragment.js";
import { vertex } from "./shaders/vertex.js";

import { Store } from "../store";

export class Media {
  constructor({ img, geometry, gl, planeDims, scene, screen, viewport }) {
    Object.assign(this, {
      img,
      geometry,
      gl,
      scene,
      screen,
      viewport,
      planeDims,
    });

    this.createTexture();
    this.createMesh();
    this.resize();
  }

  createTexture() {
    if (Store.textures[this.img.src]) {
      this.texture = Store.textures[this.img.src];
    } else {
      this.texture = new Texture(this.gl, {
        image: this.img,
        generateMipmaps: false,
        minFilter: this.gl.LINEAR,
      });
      Store.textures[this.img.src] = this.texture;
    }
  }

  createMesh() {
    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uTexture: { value: this.texture },
        uPlaneSizes: { value: [this.planeDims.w, this.planeDims.h] },
        uImageSizes: { value: [this.img.naturalWidth, this.img.naturalHeight] },
      },
      transparent: true,
    });

    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.plane.setParent(this.scene);
  }

  convertY(val) {
    return (this.viewport.height * val) / this.screen.height;
  }

  convertX(val) {
    return (this.viewport.width * val) / this.screen.width;
  }

  scale({ x = this.planeDims.w, y = this.planeDims.h }) {
    this.planeDims.w = x;
    this.planeDims.h = y;

    this.plane.scale.x = this.convertX(x);
    this.plane.scale.y = this.convertY(y);

    this.plane.program.uniforms.uPlaneSizes.value = [x, y];
  }

  translate({ x = this.plane.position.x, y = this.plane.position.y }) {
    this.plane.position.x = this.convertX(x);
    this.plane.position.y = this.convertX(y);
  }

  resize({ viewport, screen } = {}) {
    if (viewport) this.viewport = viewport;
    if (screen) this.screen = screen;

    this.ratio = {
      x: this.viewport.width / this.screen.width,
      y: this.viewport.height / this.screen.height,
    };

    this.scale({ x: this.planeDims.w, y: this.planeDims.h });
  }

  update() {
    // update uniforms?
  }
}
