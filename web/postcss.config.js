const cssnano = require("cssnano");

const plugins = [
  cssnano({
    preset: "default",
  }),
  require("postcss-combine-media-query"),
];

module.exports = {
  plugins,
};
