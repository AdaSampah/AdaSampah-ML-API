const tf = require("@tensorflow/tfjs-node");

let model;

async function loadModel() {
  try {
    model = await tf.loadGraphModel(
      "file://" + __dirname + "/../model/model.json"
    );
    console.log("Graph model loaded from local file");
  } catch (err) {
    console.error("Failed to load model:", err);
    throw err;
  }
}

async function predictHandler(request, h) {
  try {
    const file = request.payload && request.payload.image;
    if (!file) {
      return h
        .response({ error: "Image file is required (field name: image)" })
        .code(400);
    }
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [256, 256]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const prediction = model.predict(inputTensor);
    const result = prediction.dataSync();
    return { result: Array.from(result) };
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
}

module.exports = { loadModel, predictHandler };
