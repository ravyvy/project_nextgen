const settingController = require('../controller/settingController');
const setting = (app) => {
    app.get('/alerthome',settingController.alerthome)
}
module.exports = setting ;