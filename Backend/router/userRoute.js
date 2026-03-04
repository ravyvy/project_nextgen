const userController = require('../controller/userController');
const user = (app) => {
    app.get('/get_all_user',userController.get_all_user);
    app.delete('/delete_user/:id',userController.remove);
}
module.exports = user;