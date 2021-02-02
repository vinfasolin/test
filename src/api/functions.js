const sanitizer = require('sanitizer'); //Module used to sanitize form data
const striptags = require('striptags'); //module used to remove tags of form 
const isBase64 = require('is-base64'); //module used to verify if data is base64 string

//function to verify if value(string is empty)
exports.isEmpty = (value) => {

    value = String(value);

    //remove all white spaces
    value = value.replace(/\s{2,}/g, '');

    switch (value) {
      case '':
      case null:
      case typeof(value) == "undefined":
        return true;
      default:
        return false;
    }
  }


  //function to sanitize fields
  exports.sanitize = (value) => {

    //Strip tags and sanitize values
    value = striptags(value)
    value = sanitizer.sanitize(value)
    value = sanitizer.escape(value)
    return value
    
  }


  exports.truncateString = (str, num) => {

    str = String(str)
    
    if (num > str.length){
        return str;
    } else{
        str = str.substring(0, num);
        return str+"...";
    }
  
  }

  exports.currentDateTime = () => {

    let now = new Date();
   
    let year = now.getFullYear();
    let month = now.getMonth()<9 ? '0'+(now.getMonth()+ 1) : now.getMonth()+1;
    let day = now.getDate()<9 ? '0'+now.getDate() : now.getDate();

    let hours = now.getHours()<9 ? '0'+now.getHours() : now.getHours();
    let minutes = now.getMinutes()<9 ? '0'+now.getMinutes() : now.getMinutes();
    let seconds = now.getSeconds()<9 ? '0'+now.getSeconds() : now.getSeconds();

    let date = year+'-'+month+'-'+day
    let time = hours + ":" + minutes + ":" + seconds;

    let dateTime = date+' '+time;
  
    return dateTime
    
  }



  exports.isBase64 = (data, options) => {

    if(isBase64(data, options)){
      return true
    }
    else{
      return false
    }
    
  }


  
  exports.isBase64Image = (data) => {

    const base64Extension = data.split(';')[0].split('/')[1];

    if(base64Extension == 'jpeg'){
        return true
    }
    else{
        return false
    }

  }
