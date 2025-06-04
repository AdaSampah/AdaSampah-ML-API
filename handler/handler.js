const tf = require("@tensorflow/tfjs-node");
const fs = require('fs');


let modelCleanDirty;
let modelEducation;

async function loadModel() {
  try {
    modelCleanDirty = await tf.loadGraphModel(
      "file://" + __dirname + "/../model/cleanDirty/model.json"
    );
    console.log("Graph model Bersih Kotor loaded from local file");

    modelEducation = await tf.loadGraphModel(
      "file://" + __dirname + "/../model/edukasi/model.json"
    );
    console.log("Graph model Edukasi loaded from local file");
  } catch (err) {
    console.error("Failed to load model:", err);
    throw err;
  }
}

async function predictCleanDirtyHandler(request, h) {
  try {
    const file = request.payload && request.payload.image;
    if (!file) {
      return h
        .response({ error: "Image file is required (field name: image)" })
        .code(400);
    }
    const readCleanDirtyLabel = fs.readFileSync('./model/cleanDirty/label.txt', 'utf8');
    const labelCleanDirty = readCleanDirtyLabel.split('\n').map(line => line.trim());;
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const prediction = modelCleanDirty.predict(inputTensor);
    const indexLabel = tf.argMax(prediction, 1).dataSync();
    const probability = prediction.dataSync()[indexLabel];
    
    return { 
        predictedLabel: labelCleanDirty[indexLabel],
        scores: probability
    };
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
}

async function predictEdukasiHandler(request, h) {
  try {
    const file = request.payload && request.payload.image;
    if (!file) {
      return h
        .response({ error: "Image file is required (field name: image)" })
        .code(400);
    }
    const readEdukasiLabel = fs.readFileSync('./model/edukasi/label.txt', 'utf8');
    const labelEdukasi = readEdukasiLabel.split('\n').map(line => line.trim());;
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [256, 256]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const prediction = modelEducation.predict(inputTensor);
    const indexLabel = tf.argMax(prediction, 1).dataSync()[0];
    const probability = prediction.dataSync()[indexLabel];
    
    return { 
        predictedLabel: labelEdukasi[indexLabel],
        scores: probability
     };
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
}

module.exports = { loadModel, predictCleanDirtyHandler, predictEdukasiHandler };
