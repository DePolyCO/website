import { isArray, isUndefined } from "./Check";

export const qs = (s, o = document) => o.querySelector(s);

export const qsa = (s, o = document) => [...o.querySelectorAll(s)];

export const bounds = (el) => {
  const {
    top,
    right,
    bottom,
    left,
    width,
    height,
    x,
    y,
  } = el.getBoundingClientRect();

  return { top, right, bottom, left, width, height, x, y };
};

export const select = (query) => {
  if (isUndefined(query)) return [];
  if (query === window || query === document) {
    return [query];
  } else if (typeof query === "string") {
    // selector string
    return qsa(query);
  } else if (isArray(query)) {
    // nodelist
    return query;
  } else {
    // single node
    return [query];
  }
};
