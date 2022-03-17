import { IoSettingsOutline } from "react-icons/io5";

export default {
  name: "seo",
  type: "document",
  title: "SEO Settings",
  i18n: true,
  icon: IoSettingsOutline,
  __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "Describe your site for search engines and social media.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "keywords",
      type: "array",
      title: "Keywords",
      description: "Add keywords that describes your site.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required(),
    },
  ],
  initialValue: {
    title: "DePoly",
    description:
      "Rethink — Recycling: Creating a Sustainable Circular Economy for Plastics",
  },
};
