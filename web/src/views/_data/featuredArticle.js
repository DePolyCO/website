const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const featured = await client.fetch(groq`*[_type == 'featuredPost']{
        featured->{
          settings{
           "category":postCategory->title,
           "slug": slug.current,
           publishedAt
          },
          title,
          mainImage,
          intro,
          _id
        }
      }[0].featured
    `);

    return featured;
  },
  "featured-fra",
  "1d"
);
