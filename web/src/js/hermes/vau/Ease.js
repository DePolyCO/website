export const Ease = {
  linear: (m) => {
    return m;
  },
  i1: (m) => {
    return -Math.cos(m * (Math.PI / 2)) + 1;
  },
  o1: (m) => {
    return Math.sin(m * (Math.PI / 2));
  },
  io1: (m) => {
    return -0.5 * (Math.cos(Math.PI * m) - 1);
  },
  i2: (m) => {
    return m * m;
  },
  o2: (m) => {
    return m * (2 - m);
  },
  io2: (m) => {
    return m < 0.5 ? 2 * m * m : -1 + (4 - 2 * m) * m;
  },
  i3: (m) => {
    return m * m * m;
  },
  o3: (m) => {
    return --m * m * m + 1;
  },
  io3: (m) => {
    return m < 0.5 ? 4 * m * m * m : (m - 1) * (2 * m - 2) * (2 * m - 2) + 1;
  },
  i4: (m) => {
    return m * m * m * m;
  },
  o4: (m) => {
    return 1 - --m * m * m * m;
  },
  io4: (m) => {
    return m < 0.5 ? 8 * m * m * m * m : 1 - 8 * --m * m * m * m;
  },
  i5: (m) => {
    return m * m * m * m * m;
  },
  o5: (m) => {
    return 1 + --m * m * m * m * m;
  },
  io5: (m) => {
    return m < 0.5 ? 16 * m * m * m * m * m : 1 + 16 * --m * m * m * m * m;
  },
  i6: (m) => {
    return m === 0 ? 0 : Math.pow(2, 10 * (m - 1));
  },
  o6: (m) => {
    return m === 1 ? 1 : 1 - Math.pow(2, -10 * m);
  },
  io6: (m) => {
    if (m === 0) return 0;
    if (m === 1) return 1;
    if ((m /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (m - 1));
    return 0.5 * (-Math.pow(2, -10 * --m) + 2);
  },
};
