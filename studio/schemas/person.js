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
    },
    {
      name: "title",
      title: "Name",
      type: "string",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
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
