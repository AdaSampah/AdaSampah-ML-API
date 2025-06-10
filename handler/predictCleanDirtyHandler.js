const tf = require("@tensorflow/tfjs-node");
const { getModelCleanDirty } = require("./modelLoader");

async function predictCleanDirtyHandler(request, h) {
  try {
    const file = request.payload && request.payload.image;
    if (!file) {
      return h
        .response({ success: false, message: "Image file is required (field name: image)" })
        .code(400);
    }
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const model = getModelCleanDirty();
    const prediction = model.predict(inputTensor);
    const score = prediction.dataSync()[0];
    let label;
    if (score > 0.6) {
      label = "kotor";
    } 
    else if (score < 0.4) {
      label = "bersih";
    }
    else {
      label = "tidak dapat diidentifikasi";
    }
    return h.response({ success: true, predictedLabel: label, scores: score }).code(200);
  } catch (err) {
    return h.response({ success: false, message: err.message }).code(400);
  }
}

module.exports = predictCleanDirtyHandler;
