// bindAll(this, ['bindFunction1', 'bindFunction2', 'bindFunction3'])

export const bindAll = (ctx, arr) => {
  for (const method of arr) {
    ctx[method] = ctx[method].bind(ctx);
  }
};
