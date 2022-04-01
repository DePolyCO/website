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
        sites: [
          {
            title: "Website FRA",
            apiId: "535e62b7-3a8b-4272-89f8-cd7182f2d1bd",
            buildHookId: "6236cf1b1ce5761bd5865b22",
            name: "depoly-fra",
          },
          {
            title: "Website ENG",
            apiId: "8951ec5c-8774-4db0-bfa5-dfd41d6644d9",
            buildHookId: "6236cf1b1ce5761bd5865b22",
            name: "depoly",
          },
        ],
      },
    },
  ],
};
