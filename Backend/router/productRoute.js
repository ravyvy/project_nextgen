const productController = require('../controller/productController');
const upload = require('../middlewares/upload'); // Import the middleware

const products = (app) => {
    app.get('/get_all_product', productController.getall);
    app.post('/create_product', upload.single('img'), productController.create);
    app.delete('/remove_product/:id', productController.remove);
    app.post('/edit_product/:id', upload.single('img'), productController.edit);
    app.get('/searchdata_product',productController.searchData);
}
module.exports = products;