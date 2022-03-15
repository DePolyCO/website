export default {
  name: "team",
  type: "document",
  title: "Team",
  i18n: true,
  fields: [
    {
      name: "teamMembers",
      title: "Team Members",
      type: "reference",
      to: { type: "person" },
    },
    {
      name: "teamAdvisors",
      title: "Advisors",
      type: "reference",
      to: { type: "person" },
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};
