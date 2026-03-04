const dataController = require("../controller/dataController");
const getall = (app) => {
    app.get("/category/:id/products" ,dataController.getall_data );
    app.get("/getall",dataController.getall);
}
module.exports = getall;