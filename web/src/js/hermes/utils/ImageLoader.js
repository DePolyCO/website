import { Store } from "../../store";

/**
 *
 *
 * Example usage
 *
 *
 */

export const ImageLoader = ({ arr, update, complete }) => {
  //
  const n = arr.length;
  if (n === 0) {
    update && update(null, 0, 100);
    complete && complete([]);
    return;
  }

  //
  let loaded = 0;
  const running = new Array(n);
  const allImages = new Array(n);

  //
  arr.forEach((src, i) => {
    let img;
    //
    if (Store.images[src]) {
      img = Store.images[src];
      update && update(img, i, (++loaded / n) * 100);
      return img;
    } else {
      //
      img = new Image();
      img.src = src;
      const promise = new Promise((resolve) => {
        img.onload = () => {
          img
            .decode()
            .catch((e) => {
              console.log(e, src);
            })
            .finally(() => {
              update && update(img, i, (++loaded / n) * 100);
              allImages[i] = img;
              Store.images[src] = img;
              resolve();
            });
        };
      });

      running[i] = promise;
    }
  });

  //
  Promise.all(running).then(() => {
    complete && complete(allImages);
  });
};
