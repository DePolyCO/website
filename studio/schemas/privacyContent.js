import React from "react";

const HorizontalRule = () => {
  return <hr />;
};

export default {
  title: "Privacy Content",
  name: "privacyContent",
  type: "array",
  i18n: true,
  of: [
    {
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    },
    {
      type: "object",
      name: "Break",
      fields: [
        {
          name: "style",
          type: "string",
          options: {
            list: ["break"],
          },
        },
      ],
      preview: {
        component: HorizontalRule,
      },
    },
  ],
};
