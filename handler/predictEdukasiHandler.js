const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const { getModelEducation } = require("./modelLoader");

async function predictEdukasiHandler(request, h) {
  try {
    const file = request.payload && request.payload.image;
    if (!file) {
      return h
        .response({ success: false, message: "Image file is required (field name: image)" })
        .code(400);
    }
    const readEdukasiLabel = fs.readFileSync("./model/edukasi/label.txt", "utf8");
    const labelEdukasi = readEdukasiLabel.split("\n").map((line) => line.trim());
    const readDetail = fs.readFileSync("./model/edukasi/detail.json", "utf8");
    const jsonDetail = JSON.parse(readDetail);
    const readLabelIndo = fs.readFileSync("./model/edukasi/label_indo.json", "utf8");
    const jsonLabelIndo = JSON.parse(readLabelIndo);
    const buffer = file._data || file;
    let imageTensor = tf.node.decodeImage(buffer, 3);
    imageTensor = tf.image.resizeBilinear(imageTensor, [256, 256]);
    imageTensor = imageTensor.div(255.0);
    const inputTensor = imageTensor.expandDims(0);
    const model = getModelEducation();
    const prediction = model.predict(inputTensor);
    const indexLabel = tf.argMax(prediction, 1).dataSync()[0];
    const label = labelEdukasi[indexLabel];
    const probability = prediction.dataSync()[indexLabel];
    return h
      .response({
        success: true,
        predictedLabel: jsonLabelIndo[label],
        scores: probability,
        detail: jsonDetail[labelEdukasi[indexLabel]],
      })
      .code(200);
  } catch (err) {
    return h.response({ success: false, message: err.message }).code(400);
  }
}

module.exports = predictEdukasiHandler;
