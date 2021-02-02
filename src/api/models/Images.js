const fs = require('fs') //require file system nodeJs module
const Jimp = require('jimp'); //maniplate images
const imagesJsonFile = 'src/api/json/images.json'; //Define path to json file

//model to get all registers
exports.getImages = function() {
    try {
        //file system function to read json file
        const jsonData = fs.readFileSync(imagesJsonFile)
        return jsonData;
        
    } catch(error){
        console.log(error);
        return false
    }
};



exports.getImagesByEntityAndEntityId = function(entity, entityId) {
    try {
        let jsonData = fs.readFileSync(imagesJsonFile)

        //convert json data to javascript object notation
        jsonData = (JSON.parse(jsonData)).data

        jsonData = jsonData.filter( item => item.entity == entity && item.entity_id == entityId )

        return jsonData;
        
    } catch(error){
        console.log(error);
        return false
    }
};


//model to get one register by property id
exports.getImageDetail = function(id) {
    try {

        let jsonData = fs.readFileSync(imagesJsonFile)

        //convert json data to javascript object notation
        jsonData = (JSON.parse(jsonData)).data

        //Get register from object where value of property id is equals to function id
        jsonData = jsonData.find( item => item.id == id )

        return jsonData;
    
    } catch(error){
        console.log(error);
        return false
    }
}



//model to get one register by property title
exports.getImageByTitle = function(title) {
    try {

        let jsonData = fs.readFileSync(imagesJsonFile)
        jsonData = (JSON.parse(jsonData)).data
        jsonData = jsonData.find( item => item.title == title )

        console.log(jsonData)

        if(jsonData){
            return true
        }
        else{
            return false
        }
    
    } catch(error){
        console.log(error);
        return false
    }
}



//model to insert register with object send from form
exports.createImage = function(newRegisterData) {
    try {
        //convert JSON to object javascript
        let allRegistersData = JSON.parse(this.getImages())


        allRegistersData = allRegistersData.data

        //push new data to object with all registers
        allRegistersData.push(newRegisterData)

        //convert to json notation and write new data in json file 
        fs.writeFileSync(imagesJsonFile, JSON.stringify({"data": allRegistersData}))
        return true
   
    } catch(error){
        console.log(error);
        return false
    }
}


//model to delete one register by id
exports.deleteImage = function(id) {
    try {

        //Get all registers and convert to object javascript
        let allRegistersData = JSON.parse(this.getImages())
        allRegistersData = allRegistersData.data

        //Filter function remove register in object where object id is equals id passed in function
        const registeredDataWithoutDeleted = allRegistersData.filter( item => item.id != id )

        //write nnew data without register filtered
        fs.writeFileSync(imagesJsonFile, JSON.stringify({"data": registeredDataWithoutDeleted}))
        return true        

    } catch(error){
        console.log(error);
        return false
    }
}






//function to convert base64 string to image file
exports.base64ToImage = async function(fileName, base64String) {

    //remove parts of base 64 string is not used
    let base64Image = base64String.split(';base64,').pop();

    //Define filename and extension
    fileName = fileName+'.jpg'

    //path to save converted file
    const pathToSave = 'src/api/uploads/'+fileName

    try{
        //write base64 string to file and save in defined path
        await fs.writeFile(pathToSave, base64Image, {encoding: 'base64'}, function() {})
        return fileName

    }catch(error){
        console.log(error);
        return false
    }
    
}


exports.generateThumb = async function(fileName) {

    const pathToRead = 'src/api/uploads/'+fileName+'.jpg'
    const pathToSave = 'src/api/uploads/'+fileName+'_thumb.jpg'

    try {
      
        await Jimp.read(pathToRead)
        .then(imageFile => {
          return imageFile
            .resize(140, Jimp.AUTO) // resize
            .quality(80) // set JPEG quality
            .write(pathToSave); // save
        })
        .catch(err => {
          console.error(err);
        });

        return fileName+'_thumb.jpg'
        
    } catch (err) {
        console.error(err);
    }

}



//function to delete image file in server
exports.removeImageFromServer = function(fileName) {

    //path to delete file
    filePath = 'src/api/uploads/'+fileName

    try{
        //file system function to delete file
        fs.unlinkSync(filePath)
        return true
    }catch(error){
        console.log(error);
        return false
    }
    
}




