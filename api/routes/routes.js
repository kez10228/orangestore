const controller = require('../controllers/controller');
module.exports = (app) => {
    app
        .route('/deploy')
        .post(controller.deploy);
    app
        .route('/test')
        .post(controller.test);
    app
        .route('/upload')
        .post(controller.upload);
}