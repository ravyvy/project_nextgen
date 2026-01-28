const adminController = require('../controller/adminController');
const admin = (app)=>{
    app.post('/login_admin',adminController.login_admin);
    app.post('/create_admin',adminController.create);

    app.get("/admin_profile",(req , res )=>{
         res.json({
      message: "Welcome Admin",
      user: req.user
    });
    })
}
module.exports = admin