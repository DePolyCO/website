import { IoPersonAddOutline } from "react-icons/io5";

export default {
  name: "person",
  title: "People",
  type: "document",
  i18n: true,
  icon: IoPersonAddOutline,
  fields: [
    {
      name: "img",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "bio",
      title: "Bio",
      type: "bioContent",
    },
    {
      name: "social",
      type: "object",
      fields: [
        {
          name: "linkedin",
          type: "url",
          title: "Linkedin",
        },
        {
          name: "twitter",
          type: "url",
          title: "Twitter",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      lang: "__i18n_lang",
      media: "img",
    },
    prepare(selection) {
      return Object.assign({}, selection, {
        title: selection.title + " - " + selection.lang,
      });
    },
  },
};
