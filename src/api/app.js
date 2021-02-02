const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express();


const productsRoute  = require('./routes/products-route');
const categoriesRoute  = require('./routes/categories-route');
const ImagesRoute  = require('./routes/images-route');

app.use(
    express.json(),  
    express.static('src/api/uploads'),
    fileUpload(),
    cors() //Allow requests for all origins
)


app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/images', ImagesRoute);

module.exports = app;