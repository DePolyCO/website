export default {
  title: "Active Banner",
  name: "activeBanner",
  type: "object",
  fields: [
    {
      title: "Banner",
      name: "banner",
      type: "reference",
      to: [{ type: "banner" }],
      description: "Select the banner to be shown on the website.",
      options: {
        filter: '(_type == "banner" && __i18n_lang == "en")',
      },
    },
  ],
  preview: {
    select: {
      title: "banner.title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Active Banner",
    })
  }
};
