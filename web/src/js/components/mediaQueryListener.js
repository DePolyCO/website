class MediaQueryListener {
  mediaQueryList = [];

  static matches(query) {
    return window.matchMedia(query).matches;
  }

  constructor(queries) {
    this.mediaQueryList = queries.map(([query]) => window.matchMedia(query));

    this.listeners = this.mediaQueryList.map((mql, i) => {
      const [query, listener, { immediate } = { immediate: false }] = queries[i];
      mql.addListener(listener);
      if (immediate) {
        listener(window.matchMedia(query));
      }
      return listener;
    });
  }

  destroy() {
    this.mediaQueryList.forEach((mql, i) => {
      mql.removeListener(this.listeners[i]);
    });

    this.mediaQueryList = null;
    this.listeners = null;
  }
}

export default MediaQueryListener;
