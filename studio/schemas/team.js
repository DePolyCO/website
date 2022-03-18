export default {
  name: "team",
  type: "document",
  title: "Team",
  i18n: true,
  fields: [
    {
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "person" },
        },
      ],
    },
    {
      name: "teamAdvisors",
      title: "Advisors",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "person" },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};
