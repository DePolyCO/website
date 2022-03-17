import { IoDocumentsOutline } from "react-icons/io5";

export default {
  name: "category",
  title: "Article Categories",
  type: "document",
  i18n: true,
  icon: IoDocumentsOutline,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};
