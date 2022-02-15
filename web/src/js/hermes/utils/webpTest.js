export const webpTest = (callback) => {
  let s = new Image();
  s.onload = () => {
    let e = 0 < s.width && 0 < s.height;
    callback(e);
  };
  s.onerror = () => {
    callback(false);
  };
  s.src =
    "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
};
