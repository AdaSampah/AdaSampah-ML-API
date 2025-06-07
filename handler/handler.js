const tf = require("@tensorflow/tfjs-node");
const fs = require('fs');


let modelCleanDirty;
let modelEducation;
let label;

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

async function predictCleanDirtyHandler(request, h) {
  try {
    const file = request.payload && request.payload.image;
    if (!file) {
      return h
        .response({ error: "Image file is required (field name: image)" })
        .code(400);
    }
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const prediction = modelCleanDirty.predict(inputTensor);
    const score = prediction.dataSync()[0];
    if (score > 0.7){
      label = 'kotor';
    }
    else if (score < 0.4){
      label = 'bersih';
    }
    else {
      label = 'Tidak dapat diidentifikasi'
    }

    return { 
        predictedLabel: label,
        scores: score
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
    const labelEdukasi = readEdukasiLabel.split('\n').map(line => line.trim());
    const readDetail = fs.readFileSync('./model/edukasi/detail.json', 'utf8');
    const jsonDetail = JSON.parse(readDetail);
    const readLabelIndo = fs.readFileSync('./model/edukasi/label_indo.json', 'utf8');
    const jsonLabelIndo = JSON.parse(readLabelIndo);
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [256, 256]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const prediction = modelEducation.predict(inputTensor);
    const indexLabel = tf.argMax(prediction, 1).dataSync()[0];
    const label = labelEdukasi[indexLabel]
    const probability = prediction.dataSync()[indexLabel];
    
    return { 
        predictedLabel: jsonLabelIndo[label],
        scores: probability,
        detail: jsonDetail[labelEdukasi[indexLabel]]
     };
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
}

module.exports = { loadModel, predictCleanDirtyHandler, predictEdukasiHandler };
