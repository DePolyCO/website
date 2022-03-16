const imageUrl = require("@sanity/image-url");
const sanityClient = require("./sanityClient");

const urlFor = (source) => {
  return imageUrl(sanityClient).image(source);
};

module.exports = urlFor;
