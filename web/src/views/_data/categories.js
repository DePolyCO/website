const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const category = await client.fetch(groq`*[_type == 'category']{
      ...,
    }
    `);

    return category
      .filter((item) => item.__i18n_lang === "en")
      .map((item) => {
        if (item.__i18n_refs && item.__i18n_refs[0]) {
          return category.filter(
            (listItem) => listItem._id === item.__i18n_refs[0]._ref
          )[0];
        }

        return item;
      });
  },
  "categories-fra",
  "1d"
);
