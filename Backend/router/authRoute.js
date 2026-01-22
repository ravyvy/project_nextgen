const authMiddleware  = require('../middlewares/auth');
const  midd = require('../controller/authController');
const auths = (app) => {

    app.post('/register',midd.register);
    app.post('/login',midd.login);
    app.post('/logout',midd.logout);

    app.post('/profile', authMiddleware, (req, res) => {
    res.json({
      status: true,
      message: "Profile data",
      user: req.user
    });
  });
}
module.exports = auths;