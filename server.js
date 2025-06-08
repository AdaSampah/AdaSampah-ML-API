const Hapi = require("@hapi/hapi");
const routes = require("./routes/routes");
const { loadModel } = require("./handler");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.ext("onRequest", (request, h) => {
    console.log("Incoming Content-Type:", request.headers["content-type"]);
    return h.continue;
  });

  await loadModel();
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
