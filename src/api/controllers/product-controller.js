const functions = require('../functions'); 
const ProductsModel = require('../models/Products'); 
const CategoriesModel = require('../models/Categories'); 
const ImagesModel = require('../models/Images'); 

exports.getProducts = async (req, res, next) => {
    try {
        
        //Call model function getProducts()
        const result = await ProductsModel.getProducts();

        // convert result of function to object notation
        const response = JSON.parse(result)

        let resultImages = []
       
        registers = response.data;
        
        let formatedResponse = {
            data: registers.map(item => {

                let resultCategory = CategoriesModel.getCategoryDetail( item.category_id );
                //if not found register
                if (!resultCategory) {
                    category_id = ''
                    category_title = ''
                }
                else{
                    category_id = resultCategory.id
                    category_title = resultCategory.title
                }
                category = {
                    id: category_id,
                    title: category_title,
                }


                let thumb = [];

                resultImages = ImagesModel.getImagesByEntityAndEntityId( 'products', item.id );

                if (resultImages.length > 0) {
                    thumb = req.protocol+'://'+req.get('host')+'/'+resultImages[0].thumb
                }
                else{
                    thumb = []
                }

                return {
                    id: item.id,
                    title: item.title,
                    price: parseFloat(item.price).toFixed(2),
                    description: functions.truncateString(item.description, 26),
                    category: category,
                    thumb: [thumb],
                    created: item.created,
                    updated: item.updated,
                }
            })
        }

        return res.status(200).send(formatedResponse);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};



exports.getProductDetail = async (req, res, next)=> {
    try {

        let id = '';

        //varify if id from front-end is valid
        if(req.params.id > 0){
            //sanitize data from form
            id = functions.sanitize(req.params.id);
        }
        else{
            //error message
            return res.status(202).send({error: 'ID not defined'})
        }
        //Call model function getProductDetail(id)
        const result = await ProductsModel.getProductDetail(id);
        
        //if not found register
        if (!result) {
            return res.status(404).send({error: 'product not found'})
        }



        let resultCategory = CategoriesModel.getCategoryDetail( result.category_id );
        //if not found register
        if (!resultCategory) {
            category_id = ''
            category_title = ''
        }
        else{
            category_id = resultCategory.id
            category_title = resultCategory.title
        }
        category = {
            id: category_id,
            title: category_title,
        }


        let images = [];
        let thumbs = [];

        resultImages = ImagesModel.getImagesByEntityAndEntityId( 'products', result.id );

        if (resultImages.length > 0) {
            for(let i = 0; i < resultImages.length; i++){
                images[i] = req.protocol+'://'+req.get('host')+'/'+resultImages[i].image
                thumbs[i] = req.protocol+'://'+req.get('host')+'/'+resultImages[i].thumb
            }
        }
        else{
            images = []
            thumbs = []
        }



        //format result to show in route
        const response = {
            "data": [
                {
                    id: result.id,
                    title: result.title,
                    price: parseFloat(result.price).toFixed(2),
                    description: result.description,
                    category: category,
                    images: images,
                    thumbs: thumbs,
                    created: result.created,
                    updated: result.updated,
                }
            ]
        }

        return res.status(200).send(response);   

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};



exports.createProduct = async (req, res, next) => {
    try {

        //define object
        newRegisterData = {}

        //GENERATE ID with timestamp
        let d = new Date();
        newRegisterData.id = d.getTime();

        //sanitize all data from form 
        newRegisterData.title = functions.sanitize(req.body.title)

        newRegisterData.price = functions.sanitize(req.body.price)
        newRegisterData.price = (parseFloat(newRegisterData.price).toFixed(2))

        newRegisterData.description = functions.sanitize(req.body.description)
        newRegisterData.category_id = functions.sanitize(req.body.category_id)



        //verify if data from form is empty
        if(
            functions.isEmpty(newRegisterData.title) ||
            functions.isEmpty(newRegisterData.price) ||
            functions.isEmpty(newRegisterData.description) ||
            functions.isEmpty(newRegisterData.category_id)
 
        ){
            return res.status(202).send({error: 'blank fields'})
        }


        //verify if this title exists in some register if json file
        if(ProductsModel.getProductByTitle(newRegisterData.title)){
            return res.status(202).send({error: 'This title already exists'}) 
        } 

        newRegisterData.created = functions.currentDateTime()
        newRegisterData.updated = 'Never'



        //call function to insert data
        const result = await ProductsModel.createProduct(newRegisterData);
        
        //if result is not false, define formated data to send to route
        if(result){

            const link = req.protocol+'://'+req.get('host')+req.originalUrl
            const response = {
                message: 'Product created sucessfully',
                createdProduct: {
                    id: newRegisterData.id,
                    title: newRegisterData.title,
                    price: newRegisterData.price,
                    description: newRegisterData.description,
                    created: newRegisterData.created,
                    updated: newRegisterData.updated,

                    request: {
                        type: 'GET',
                        description: 'Return all products',
                        url: link
                    }
                }
            }
            return res.status(201).send(response);   
        }

        else{
            return res.status(500).send({ error: 'Error at create product' });
        }
        


    } catch (error) {
        return res.status(500).send({ error: error });
    }
};





exports.updateProduct = async (req, res, next) => {

    try {

        let result = false;

        let id = '';

        //verify if id from front-end is valid
        if(req.params.id > 0){
            id = functions.sanitize(req.params.id);
        }
        else{
            return res.status(500).send({error: 'ID not defined'})
        }

        //Verify if registers with this id exists
        const findProduct = await ProductsModel.getProductDetail(id);

        //If register exists
        if(findProduct){
            
            newRegisterData = {}

            newRegisterData.id = findProduct.id;

            // if data from form is equals data from json file

            if(findProduct.title == functions.sanitize(req.body.title)){
                newRegisterData.title = findProduct.title;
            }
            else{
                newRegisterData.title = functions.sanitize(req.body.title);
            }


            if(findProduct.price == functions.sanitize(req.body.price)){
                newRegisterData.price = findProduct.price;
            }
            else{
                newRegisterData.price = functions.sanitize(req.body.price);
                newRegisterData.price = parseFloat(newRegisterData.price).toFixed(2)
            }


            if(findProduct.description == functions.sanitize(req.body.description)){
                newRegisterData.description = findProduct.description;
            }
            else{
                newRegisterData.description = functions.sanitize(req.body.description);
            }


            if(findProduct.category_id == functions.sanitize(req.body.category_id)){
                newRegisterData.category_id = findProduct.category_id;
            }
            else{
                newRegisterData.category_id = functions.sanitize(req.body.category_id);
            }

  

            if(
                functions.isEmpty(newRegisterData.title) ||
                functions.isEmpty(newRegisterData.price) ||
                functions.isEmpty(newRegisterData.description) ||
                functions.isEmpty(newRegisterData.category_id)

            ){
                return res.status(202).send({error: 'blank fields'})
            }


            newRegisterData.created = findProduct.created
            newRegisterData.updated = functions.currentDateTime()



            //call function to Delete current data
            await ProductsModel.deleteProduct(findProduct.id);

            //call function to Insert new data defined previusly
            result = await ProductsModel.createProduct(newRegisterData);


        }
        else{
            return res.status(404).send({ error: 'Product with ID '+id+' not found' });
        }


        //if data is sucessfully insertd, send formated data to route
        if(result){
            const link = req.protocol+'://'+req.get('host')+req.originalUrl
            const response = {
                message: 'Product updated sucessfully',
                updatedProduct: {
                    id: id,
                    title: newRegisterData.title,
                    price: newRegisterData.price,
                    description: newRegisterData.description,
                    created: newRegisterData.created,
                    updated: newRegisterData.updated,

                    request: {
                        type: 'GET',
                        description: 'Return product with id '+id,
                        url: link
                    }
                }
            }
            return res.status(200).send(response);   
        }
        else{
            return res.status(500).send({ 'error': 'Error at update product' });
        }
        


    } catch (error) {
        return res.status(500).send({ error: error });
    }
};





exports.deleteProduct = async (req, res, next) => {
    try {

        let id = '';

        if(req.params.id > 0){
            id = functions.sanitize(req.params.id);
        }
        else{
            return res.status(500).send({error: 'ID not defined'})
        }

        //verify id registers exists
        const findProduct = await ProductsModel.getProductDetail(id);
        if(!findProduct){
            return res.status(404).send({ error: 'Product with ID '+id+' not found' });
        }

        //cal function to delete register
        const result = await ProductsModel.deleteProduct(id);
  

        if(result){

            //Vou precisar resgatar a imagem com entity e entity_id
            let images = [];

            resultImages = ImagesModel.getImagesByEntityAndEntityId( 'products', id );

            if (resultImages.length > 0) {
                for(let i = 0; i < resultImages.length; i++){
                    //Remove all image files of this proudct
                    ImagesModel.removeImageFromServer(resultImages[i].image);
                    ImagesModel.deleteImage(resultImages[i].id);
                }

            }
          
            return res.status(200).send({message: 'Product with ID '+id+' was successfully deleted'});
        }



    } catch (error) {
        return res.status(500).send({ error: error });
    }
};



