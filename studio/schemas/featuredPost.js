export default {
  title: "Featured Post",
  name: "featuredPost",
  type: "object",
  fields: [
    {
      title: "Featured Post",
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
          title: "Featured Post",
        }
      );
    },
  },
};
