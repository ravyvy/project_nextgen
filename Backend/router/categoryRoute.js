const categoryController = require('../controller/categoryController');
const upload = require('../middlewares/upload'); // Import the middleware

const categorys = (app) => {
    app.get('/get_all', categoryController.getall);
    app.post('/create',  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'imgone', maxCount: 1 },
    { name: 'imgtwo', maxCount: 1 }
  ]), categoryController.create);

    app.delete('/remove/:id', categoryController.remove);
    
    app.post('/edit/:id',upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'imgone', maxCount: 1 },
    { name: 'imgtwo', maxCount: 1 }
  ]), categoryController.edit);

    app.get('/searchdata',categoryController.searchData);
}
module.exports = categorys;