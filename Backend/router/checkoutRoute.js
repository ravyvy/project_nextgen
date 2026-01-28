const checkController = require('../controller/checkoutController');
const check = (app) => {
    // app.post("/telegram",checkController.telegram);
    // app.post("/dborder",checkController.dborder);
   app.post("/order",checkController.orderController);
   app.get('/get_all_order',checkController.get_all_order)
}
module.exports = check;