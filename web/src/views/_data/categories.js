const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const category = await client.fetch(groq`*[_type == 'category']{
      ...,
    }
    `);

    return category.filter((item) => item.__i18n_lang === "en");
  },
  "categories",
  "1d"
);
