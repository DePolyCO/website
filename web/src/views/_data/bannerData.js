const withCache = require("../../../utils/cache");
const client = require("../../../utils/sanityClient");
const groq = require("groq");

module.exports = withCache(async () => {
  // For `fr` concat  + "__i18n_fr" with path(^.banner._ref)
  const { banner } = await client.fetch(
    groq`
      *[_type == "activeBanner"][0] {
        "banner": *[_type == "banner" && _id in path(^.banner._ref)][0] {
          highlights[]-> {
            "logo": logo.asset->url,
            link,
            linkText
          },
          link,
          prefix,
          withSeparator,
          tileOnMobile,
          "id": _id
        }
      }
    `
  );
  return banner;
}, "bannerData");
