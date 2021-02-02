const express = require('express'); //Require express module to use routes
const router = express.Router(); //use router function from express
const ProductsController = require('../controllers/product-controller'); //require controller

router.get('/', ProductsController.getProducts); //http GET method to get all registers
router.get('/:id', ProductsController.getProductDetail); //http GET method to get one register by id
router.post('/', ProductsController.createProduct); //http POST method to insert data from form
router.put('/:id', ProductsController.updateProduct); //http PUT method to update with data from form
router.delete('/:id', ProductsController.deleteProduct); //http DELETE method to delete one register by id

module.exports = router; //export orutes to use in app.js