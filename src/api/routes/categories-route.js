const express = require('express'); //Require express module to use routes
const router = express.Router(); //use router function from express
const CategoriesController = require('../controllers/category-controller'); //require controller

router.get('/', CategoriesController.getCategories); //http GET method to get all registers
router.get('/:id', CategoriesController.getCategoryDetail); //http GET method to get one register by id
router.post('/', CategoriesController.createCategory); //http POST method to insert data from form
router.put('/:id', CategoriesController.updateCategory); //http PUT method to update with data from form
router.delete('/:id', CategoriesController.deleteCategory); //http DELETE method to delete one register by id

module.exports = router; //export orutes to use in app.js