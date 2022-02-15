export const fragment = `
precision highp float;

uniform sampler2D uTexture;

varying vec3 vUv;

void main() {
  vec4 texture = texture2D(uTexture, vUv.xy);
  gl_FragColor = texture;
}
`;
