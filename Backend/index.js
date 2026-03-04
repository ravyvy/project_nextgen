const express = require('express');
const path = require('path'); // Add this
const app = express();
var cors = require('cors')

// use cors
app.use(cors())
// Middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images folder so they are accessible via https://project-nextgen-1dnjds.onrender.com/images/filename.jpg
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));

// setting route fetch to dashboard
const setting = require('./router/SettingRoute');
setting(app);
// for got password
const forgot = require('./router/forgotRoute');
forgot(app);
// total count and total amount
const total = require('./router/totalRoute');
total(app);
// admin
const admin = require('./router/adminRoute');
admin(app);
// userRoute
const user = require('./router/userRoute');
user(app);
// checkout
const check = require('./router/checkoutRoute');
check(app);
// auths
const auths = require('./router/authRoute');
auths(app);

// productd
const products = require('./router/productRoute');
products(app);

// category
const category = require('./router/categoryRoute');
category(app);

// data category + products
const dataall = require('./router/dataRoute');
dataall(app);

app.get('/', (req, res) => {
  res.send("serve run !!")
})
// ... rest of your index.js
const port = 9000;
app.listen(port, () => {
  console.log('http://localhost:' + port);
});
