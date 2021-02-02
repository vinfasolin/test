const functions = require('../functions'); 
const ImagesModel = require('../models/Images'); 

exports.getImages = async (req, res, next) => {
    try {
        
        //Call model function getImages()
        const result = await ImagesModel.getImages();

        // convert result of function to object notation
        const response = JSON.parse(result)
       
        registers = response.data;
        
        let formatedResponse = {
            data: registers.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    entity: item.entity,
                    entity_id: item.entity_id,
                    link: req.protocol+'://'+req.get('host')+'/'+item.image,
                    thumb: req.protocol+'://'+req.get('host')+'/'+item.thumb
                }
            })
        }

        return res.status(200).send(formatedResponse);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};


exports.getImageDetail = async (req, res, next)=> {
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
        //Call model function getImageDetail(id)
        const result = await ImagesModel.getImageDetail(id);
        
        //if not found register
        if (!result) {
            return res.status(404).send({error: 'image not found'})
        }


        //format result to show in route
        const response = {
            "data": [
                {
                  id:  result.id,
                  title: result.title,
                  entity: result.entity,
                  entity_id: result.entity_id,
                  link: req.protocol+'://'+req.get('host')+'/'+result.image,
                  thumb: req.protocol+'://'+req.get('host')+'/'+result.thumb
                }
            ]
        }


        return res.status(200).send(response);   

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};



exports.createImage = async (req, res, next) => {
    try {

        //define object
        newRegisterData = {}

        //GENERATE ID with timestamp
        let d = new Date();
        newRegisterData.id = d.getTime();

        //Generate random title
        newRegisterData.title = Math.random().toString(36).substr(2, 12);

        //sanitize all data from form 
        newRegisterData.image = functions.sanitize(req.body.image)
        newRegisterData.thumb = ''
        newRegisterData.entity = functions.sanitize(req.body.entity)
        newRegisterData.entity_id = functions.sanitize(req.body.entity_id)

        //verify if data from form is empty
        if(
            functions.isEmpty(newRegisterData.image) ||
            functions.isEmpty(newRegisterData.entity) ||
            functions.isEmpty(newRegisterData.entity_id)
        ){
            return res.status(202).send({error: 'blank fields'})
        }


        //verify if this title exists in some register in json file
        if(ImagesModel.getImageByTitle(newRegisterData.title)){
            return res.status(202).send({error: 'This title already exists'}) 
        } 


        //verify if base64 string is valid
        if(functions.isBase64(newRegisterData.image, {allowMime: true})){

            //verify if is a image in jpg format
            if(functions.isBase64Image(newRegisterData.image)){
                //create file with id to generate name and image(base64_string)
                newRegisterData.image = await ImagesModel.base64ToImage(newRegisterData.title, newRegisterData.image) 
                
                if(newRegisterData.image){
                    newRegisterData.thumb = await ImagesModel.generateThumb(newRegisterData.title)  
                }
            }

            else{
                return res.status(202).send({error: 'image is an invalid format. Only jpg is accepted'})
            }

            
        }
        else{
            return res.status(202).send({error: 'base64 image is not valid'})
        }



        //call function to insert data
        const result = await ImagesModel.createImage(newRegisterData);
        
        //if result is not false, define formated data to send to route
        if(result){

            const link = req.protocol+'://'+req.get('host')+req.originalUrl
            const response = {
                message: 'Image created sucessfully',
                createdImage: {
                    id: newRegisterData.id,
                    title: newRegisterData.title,
                    entity: newRegisterData.entity,
                    entity_id: newRegisterData.entity_id,
                    link: req.protocol+'://'+req.get('host')+'/'+newRegisterData.image,
                    thumb: req.protocol+'://'+req.get('host')+'/'+newRegisterData.thumb,
                    request: {
                        type: 'GET',
                        description: 'Return all images',
                        url: link
                    }
                }
            }
            return res.status(201).send(response);   
        }

        else{
            return res.status(500).send({ error: 'Error at create image' });
        }
        


    } catch (error) {
        return res.status(500).send({ error: error });
    }
};





exports.updateImage = async (req, res, next) => {

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
        const findImage = await ImagesModel.getImageDetail(id);

        //If register exists
        if(findImage){
            
            newRegisterData = {}

            newRegisterData.id = findImage.id;
            newRegisterData.title = findImage.title;
            newRegisterData.image = findImage.image
            newRegisterData.thumb = findImage.thumb
   

            if(findImage.entity == functions.sanitize(req.body.entity)){
                newRegisterData.entity = findImage.entity;
            }
            else{
                newRegisterData.entity = functions.sanitize(req.body.entity);
            }
   
            if(findImage.entity_id == functions.sanitize(req.body.entity_id)){
                newRegisterData.entity_id = findImage.entity_id;
            }
            else{
                newRegisterData.entity_id = functions.sanitize(req.body.entity_id);
            }




            if(!functions.isEmpty(functions.sanitize(req.body.image))){

                const newImage = functions.sanitize(req.body.image);

                if(functions.isBase64(newImage, {allowMime: true})){

                   //verify if is a image in jpg format
                   if(functions.isBase64Image(newImage)){
                        let imageLink = await ImagesModel.base64ToImage(newRegisterData.title, newImage)

                        if(imageLink){
                            await ImagesModel.generateThumb(newRegisterData.title)  
                        }
                   }
                   else{
                        return res.status(202).send({error: 'image is an invalid format. Only jpg is accepted'})
                   }
                }
                else{
                    return res.status(202).send({error: 'base64 image is not valid'})
                }

            }


            //call function to Delete current data
            await ImagesModel.deleteImage(newRegisterData.id);

            //call function to Insert new data defined previusly
            result = await ImagesModel.createImage(newRegisterData);


        }
        else{
            return res.status(404).send({ error: 'Image with ID '+id+' not found' });
        }


        //if data is sucessfully insertd, send formated data to route
        if(result){
            const link = req.protocol+'://'+req.get('host')+req.originalUrl
            const response = {
                message: 'Image updated sucessfully',
                updatedImage: {
                    id: id,
                    title: newRegisterData.title,
                    entity: newRegisterData.entity,
                    entity_id: newRegisterData.entity_id,
                    link: req.protocol+'://'+req.get('host')+'/'+newRegisterData.image,
                    thumb: req.protocol+'://'+req.get('host')+'/'+newRegisterData.thumb,
                    request: {
                        type: 'GET',
                        description: 'Return image with id '+id,
                        url: link
                    }
                }
            }
            return res.status(200).send(response);   
        }
        else{
            return res.status(500).send({ 'error': 'Error at update image' });
        }
        


    } catch (error) {
        return res.status(500).send({ error: error });
    }
};




exports.deleteImage = async (req, res, next) => {
    try {

        let id = '';

        if(req.params.id > 0){
            id = functions.sanitize(req.params.id);
        }
        else{
            return res.status(500).send({error: 'ID not defined'})
        }

        //verify id registers exists
        const findImage = await ImagesModel.getImageDetail(id);
        if(!findImage){
            return res.status(404).send({ error: 'Image with ID '+id+' not found' });
        }

        //cal function to delete register
        const result = await ImagesModel.deleteImage(id);
  

        if(result){
            //call  function to delete image file from server
            await ImagesModel.removeImageFromServer(findImage.image)
            await ImagesModel.removeImageFromServer(findImage.thumb)
            return res.status(200).send({message: 'Image with ID '+id+' was successfully deleted'});
        }
 
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};






