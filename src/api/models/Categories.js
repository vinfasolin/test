const fs = require('fs') //require file system nodeJs module
const categoriesJsonFile = 'src/api/json/categories.json'; //Define path to json file

//model to get all registers
exports.getCategories = function() {
    try {
        //file system function to read json file
        const jsonData = fs.readFileSync(categoriesJsonFile)
        return jsonData;
        
    } catch(error){
        console.log(error);
        return false
    }
};


//model to get one register by property id
exports.getCategoryDetail = function(id) {
    try {

        let jsonData = fs.readFileSync(categoriesJsonFile)

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
exports.getCategoryByTitle = function(title) {
    try {

        let jsonData = fs.readFileSync(categoriesJsonFile)
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
exports.createCategory = function(newRegisterData) {
    try {
        //convert JSON to object javascript
        let allRegistersData = JSON.parse(this.getCategories())


        allRegistersData = allRegistersData.data

        //push new data to object with all registers
        allRegistersData.push(newRegisterData)

        //convert to json notation and write new data in json file 
        fs.writeFileSync(categoriesJsonFile, JSON.stringify({"data": allRegistersData}))
        return true
   
    } catch(error){
        console.log(error);
        return false
    }
}


//model to delete one register by id
exports.deleteCategory = function(id) {
    try {

        //Get all registers and convert to object javascript
        let allRegistersData = JSON.parse(this.getCategories())
        allRegistersData = allRegistersData.data

        //Filter function remove register in object where object id is equals id passed in function
        const registeredDataWithoutDeleted = allRegistersData.filter( item => item.id != id )

        //write nnew data without register filtered
        fs.writeFileSync(categoriesJsonFile, JSON.stringify({"data": registeredDataWithoutDeleted}))
        return true        

    } catch(error){
        console.log(error);
        return false
    }
}


