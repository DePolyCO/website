export const isUndefined = (o) => o === undefined;

export const isArray = (o) => o.constructor === Array;

export const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};
