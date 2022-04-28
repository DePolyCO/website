const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const jobs = await client.fetch(groq`*[_type == 'jobs']{
      ...,
    }
    `);

    const filtered = jobs
      .filter((item) => item.__i18n_lang === "en")
      .map((item) => {
        const levels = Object.keys(item.level).filter((key) => {
          if (item.level[key]) {
            if (key === "Medior") {
              return "Mid-Level";
            }
            return key;
          }
        });
        if (levels.length < 3) {
          item.levels = levels.join("/");
        } else {
          item.levels = "All levels";
        }

        return item;
      });

    return filtered;
  },
  "jobs",
  "1d"
);
