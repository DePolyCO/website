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
      name: "title",
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
};
