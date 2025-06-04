const { predictHandler } = require("../handler/handler");

module.exports = [
  {
    method: "POST",
    path: "/predict",
    handler: predictHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 5000000,
      },
    },
  },
];
