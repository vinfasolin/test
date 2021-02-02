const express = require('express'); //Require express module to use routes
const router = express.Router(); //use router function from express
const ImagesController = require('../controllers/image-controller'); //require controller

router.get('/', ImagesController.getImages); //http GET method to get all registers
router.get('/:id', ImagesController.getImageDetail); //http GET method to get one register by id
router.post('/', ImagesController.createImage); //http POST method to insert data from form
router.put('/:id', ImagesController.updateImage); //http PUT method to update with data from form
router.delete('/:id', ImagesController.deleteImage); //http DELETE method to delete one register by id

module.exports = router; //export orutes to use in app.js