const {
  predictCleanDirtyHandler,
  predictEdukasiHandler,
} = require("../handler");

module.exports = [
  {
    method: "POST",
    path: "/predictModel1",
    handler: predictCleanDirtyHandler,
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
    handler: predictEdukasiHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 5000000,
      },
    },
  },
];
