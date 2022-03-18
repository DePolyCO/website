const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const seo = await client.fetch(groq`*[_type == 'seo']{
      ...,
    }
    `);

    return seo.filter((item) => item.__i18n_lang === "en")[0];
  },
  "seo",
  "1d"
);

// module.exports = {
//   title: "DePoly",
//   description: "Placeholder",
//   keywords: "",
//   baseURL: "",
// };
