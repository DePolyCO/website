export default {
  title: "Bio Content",
  name: "bioContent",
  type: "array",
  i18n: true,
  of: [
    {
      title: "Block",
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [],
        annotations: [],
      },
    },

    {
      name: "fact",
      title: "Fact",
      type: "object",
      fields: [
        {
          name: "gist",
          title: "Gist of fact",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "tags",
          title: "Tags",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
          options: {
            layout: "tags",
          },
        },
      ],
    },
  ],
};
