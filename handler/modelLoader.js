const tf = require("@tensorflow/tfjs-node");

let modelCleanDirty;
let modelEducation;

async function loadModel() {
  try {
    modelCleanDirty = await tf.loadGraphModel(
      "file://" + __dirname + "/../model/cleanDirty/main/model.json"
    );
    console.log("Graph model Bersih Kotor loaded from local file");

    modelEducation = await tf.loadGraphModel(
      "file://" + __dirname + "/../model/edukasi/main/model.json"
    );
    console.log("Graph model Edukasi loaded from local file");
  } catch (err) {
    console.error("Failed to load model:", err);
    throw err;
  }
}

function getModelCleanDirty() {
  return modelCleanDirty;
}

function getModelEducation() {
  return modelEducation;
}

module.exports = { loadModel, getModelCleanDirty, getModelEducation };
