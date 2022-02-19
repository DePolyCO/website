export const lerp = (a, b, n) => (1 - n) * a + n * b;

export const slerp = (a, b, n) => ((((b - a) % 360) + 540) % 360) - 180 * n;

export const map = (val, a, b, c, d) => ((val - a) * (d - c)) / (b - a) + c;

export const clamp = (val, min, max) => Math.min(Math.max(min, val), max);

export const round = (val, p = 1e3) => Math.round(val * p) / p;

export const invlerp = (a, b, n) => clamp((n - a) / (b - a), 0, 1);

// frame delta aware verion of lerp
// lambda = Math.log(1 - r/15) ~approx
// damp(old, new, rate, deltaTime)
export const damp = (a, b, lambda, dt) => {
  return lerp(a, b, 1 - Math.exp(lambda * dt));
};
