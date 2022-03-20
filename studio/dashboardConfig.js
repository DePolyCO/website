export default {
  widgets: [
    {
      name: "project-info",
    },
    {
      name: "project-users",
    },
    {
      name: "netlify",
      options: {
        // title: "My Netlify deploys",
        sites: [
          {
            title: "Website",
            apiId: "ff63d67c-e980-493c-ac5d-341dc0f0d65e",
            buildHookId: "6236cf1b1ce5761bd5865b22",
            name: "depoly",
          },
        ],
      },
    },
  ],
};
