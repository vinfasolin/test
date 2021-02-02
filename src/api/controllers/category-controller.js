const functions = require('../functions'); 
const CategoriesModel = require('../models/Categories'); 


exports.getCategories = async (req, res, next) => {
    try {
        
        //Call model function getCategories()
        const result = await CategoriesModel.getCategories();

        // convert result of function to object notation
        const response = JSON.parse(result)
       
        registers = response.data;
        
        let formatedResponse = {
            data: registers.map(item => {
                return {
                    id: item.id,
                    title: item.title
                }
            })
        }

        return res.status(200).send(formatedResponse);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};




exports.getCategoryDetail = async (req, res, next)=> {
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
        //Call model function getCategoryDetail(id)
        const result = await CategoriesModel.getCategoryDetail(id);
        
        //if not found register
        if (!result) {
            return res.status(404).send({error: 'category not found'})
        }

        //format result to show in route
        const response = {
            "data": [
                {
                  id:  result.id,
                  title: result.title
                }
            ]
        }

        return res.status(200).send(response);   

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};



exports.createCategory = async (req, res, next) => {
    try {

        //define object
        newRegisterData = {}

        //GENERATE ID with timestamp
        let d = new Date();
        newRegisterData.id = d.getTime();

        //sanitize all data from form 
        newRegisterData.title = functions.sanitize(req.body.title)


        //verify if data from form is empty
        if(
            functions.isEmpty(newRegisterData.title)
        ){
            return res.status(202).send({error: 'blank fields'})
        }



        //verify if this title exists in some register if json file
        if(CategoriesModel.getCategoryByTitle(newRegisterData.title)){
            return res.status(202).send({error: 'This title already exists'}) 
        } 

        //call function to insert data
        const result = await CategoriesModel.createCategory(newRegisterData);
        
        //if result is not false, define formated data to send to route
        if(result){

            const link = req.protocol+'://'+req.get('host')+req.originalUrl
            const response = {
                message: 'Category created sucessfully',
                createdCategory: {
                    id: newRegisterData.id,
                    title: newRegisterData.title,
                    request: {
                        type: 'GET',
                        description: 'Return all categories',
                        url: link
                    }
                }
            }
            return res.status(201).send(response);   
        }

        else{
            return res.status(500).send({ error: 'Error at create category' });
        }
        


    } catch (error) {
        return res.status(500).send({ error: error });
    }
};





exports.updateCategory = async (req, res, next) => {

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
        const findCategory = await CategoriesModel.getCategoryDetail(id);

        //If register exists
        if(findCategory){
            
            newRegisterData = {}

            newRegisterData.id = findCategory.id;

            // if data from form is equals data from json file

            if(findCategory.title == functions.sanitize(req.body.title)){
                newRegisterData.title = findCategory.title;
            }
            else{
                newRegisterData.title = functions.sanitize(req.body.title);
            }

            if( 
                functions.isEmpty(newRegisterData.title) 
            ){
                return res.status(202).send({error: 'blank fields'})
            }


            //call function to Delete current data
            await CategoriesModel.deleteCategory(findCategory.id);

            //call function to Insert new data defined previusly
            result = await CategoriesModel.createCategory(newRegisterData);


        }
        else{
            return res.status(404).send({ error: 'Category with ID '+id+' not found' });
        }


        //if data is sucessfully insertd, send formated data to route
        if(result){
            const link = req.protocol+'://'+req.get('host')+req.originalUrl
            const response = {
                message: 'Category updated sucessfully',
                updatedCategory: {
                    id: id,
                    title: newRegisterData.title,     
                    request: {
                        type: 'GET',
                        description: 'Return category with id '+id,
                        url: link
                    }
                }
            }
            return res.status(200).send(response);   
        }
        else{
            return res.status(500).send({ 'error': 'Error at update category' });
        }
        


    } catch (error) {
        return res.status(500).send({ error: error });
    }
};





exports.deleteCategory = async (req, res, next) => {
    try {

        let id = '';

        if(req.params.id > 0){
            id = functions.sanitize(req.params.id);
        }
        else{
            return res.status(500).send({error: 'ID not defined'})
        }

        //verify id registers exists
        const findCategory = await CategoriesModel.getCategoryDetail(id);
        if(!findCategory){
            return res.status(404).send({ error: 'Category with ID '+id+' not found' });
        }

        //cal function to delete register
        const result = await CategoriesModel.deleteCategory(id);
  

        if(result){
            return res.status(200).send({message: 'Category with ID '+id+' was successfully deleted'});
        }

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

