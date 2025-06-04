const { predictHandlerCleanDirty, predictHandlerEdukasi } = require("../handler/handler");

module.exports = [
  {
    method: "POST",
    path: "/predictModel1",
    handler: predictHandlerCleanDirty,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 5000000,
      },
    },
  },

  {
    method: "POST",
    path: "/predictModel2",
    handler: predictHandlerEdukasi,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 5000000,
      },
    },
  },
];
