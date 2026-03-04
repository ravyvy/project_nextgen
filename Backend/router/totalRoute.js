const totalController = require('../controller/totalController');
const total = (app) => {
    app.post('/deletetotal',totalController.total)
    app.get('/get_users',totalController.totaluser);
    app.get('/get_category',totalController.totalcategory);
    app.get('/get_sale',totalController.getMonthlySales);
    app.get('/get_storeOrder',totalController.storeOrder);
    app.get('/get_total',totalController.get_total);
    app.get('/totalold',totalController.totalold);
}
module.exports = total;