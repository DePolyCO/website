import { select } from "./Dom";

/**
 * Usage:
 * ======
 *     
 * const callback = (node, isIntersecting, unobserve) => {
      if (isIntersecting) {
        if (this.once) {
          unobserve(node);
        }
        console.log(node, "is visible")
      } else if (!this.once) {
        console.log(node, "was hidden")
      }
    };

    const o = Observer().create({
      callback,
      offset: `-5px`,
      threshold: 0.1,
    });

    o.observe(wrapperSelector);
 * 
 */

export const Observer = () => {
  const create = (options) => {
    const change = (entries, observer) => {
      const unobserve = (node) => observer.unobserve(node);

      entries.forEach((entry, idx) => {
        options.callback(
          entry.target,
          entry.isIntersecting,
          unobserve,
          entry,
          idx
        );
      });
    };

    const observer = new IntersectionObserver(change, {
      root: null,
      rootMargin: `${options.offset || `0px`}`,
      threshold: options.threshold || 0,
    });

    return {
      observe: (targets) => {
        const nodes = select(targets);
        nodes.forEach((node) => {
          observer.observe(node);
        });
      },
      unobserve: () => observer.unobserve(target),
      disconnect: () => observer.disconnect(),
    };
  };

  return {
    create,
  };
};
