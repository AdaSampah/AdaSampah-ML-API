const { loadModel, getModelCleanDirty, getModelEducation } = require("./modelLoader");
const predictCleanDirtyHandler = require("./predictCleanDirtyHandler");
const predictEdukasiHandler = require("./predictEdukasiHandler");

module.exports = {
  loadModel,
  getModelCleanDirty,
  getModelEducation,
  predictCleanDirtyHandler,
  predictEdukasiHandler,
};
