const forgotController = require('../controller/forgotController');
const forgot = (app) => {
    app.post('/forgot_password',forgotController.forgot_password);
    app.post('/reset_password',forgotController.reset_password);
    app.post('/verify_reset_code',forgotController.verify_reset_code);
}
module.exports = forgot;