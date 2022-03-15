import { IoPersonAddOutline } from "react-icons/io5";

export default {
  name: "person",
  title: "People",
  type: "document",
  i18n: true,
  icon: IoPersonAddOutline,
  fields: [
    {
      name: "title",
      title: "Name",
      type: "string",
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
    },
    {
      name: "social",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "socialLink",
              title: "URL",
              type: "url",
            },
            {
              name: "socialLabel",
              title: "Name of platform",
              type: "string",
              options: {
                list: [
                  { title: "Linkedin", value: "li" },
                  { title: "Twitter", value: "tw" },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
