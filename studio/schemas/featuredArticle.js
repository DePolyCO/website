export default {
  title: "Featured Article",
  name: "featuredArticle",
  type: "object",
  fields: [
    {
      title: "Featured Article",
      name: "featured",
      type: "reference",
      to: [{ type: "post" }],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      return Object.assign(
        {},
        {
          title: "Featured Article",
        }
      );
    },
  },
};
