import { IoTicketOutline } from "react-icons/io5";
import uniqueFilter from "../utils/uniqueFilter";

export default {
  name: "banner",
  title: "Banners",
  type: "document",
  i18n: true,
  icon: IoTicketOutline,
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string",
      description: "Used as a help to easily identify the banner.",
    },
    {
      title: "Prefix",
      name: "prefix",
      type: "string",
      description: "Text shown befeore the highlights.",
    },
    {
      title: "Highlights",
      name: "highlights",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "highlight" },
          options: {
            filter: ({ document }) => uniqueFilter(document, "highlights"),
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: "Link",
      name: "link",
      type: "url",
      description: "Read more link.",
    },
    {
      title: "With Seperator",
      name: "withSeparator",
      type: "boolean",
      description: "Show sperators between the highlights.",
    },
  ],
  initialValue: {
    prefix: "We have been higlighted in",
    withSeparator: true,
  },
};
