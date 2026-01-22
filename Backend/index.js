const express = require('express');
const path = require('path'); // Add this
const app = express();

// Middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images folder so they are accessible via http://localhost:9000/images/filename.jpg
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));

// auths
const auths = require('./router/authRoute');
auths(app);

// product
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
