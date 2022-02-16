// const client = require("../../../utils/sanityClient");
// const groq = require("groq");

// const withCache = require("../../../utils/cache");

// module.exports = withCache(
//   async () => {
//     const seo = await client.fetch(groq`*[_type == 'seo']{
//       ...,
//     }[0]
//     `);

//     return seo;
//   },
//   "seo",
//   "1d"
// );

module.exports = {
  title: "DePoly",
  description: "Placeholder",
  keywords: "",
  baseURL: "",
};
