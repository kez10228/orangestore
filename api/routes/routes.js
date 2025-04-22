const controller = require("../controllers/controller");

module.exports = (app) => {
  app.route("/deploy").post(controller.deploy);
  app.route("/test").get(controller.test);
  app.route("/upload").post(controller.upload);
  app.route("/uploads/:filename").get(controller.uploads); // Serve uploaded files
};
