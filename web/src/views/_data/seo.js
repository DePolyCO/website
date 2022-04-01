const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const seo = await client.fetch(groq`*[_type == 'seo']{
      ...,
    }
    `);

    return seo.filter((item) => item.__i18n_lang === "fr")[0];
  },
  "seo-fra",
  "1d"
);
