const mongoose=require('mongoose')
const postschema=new mongoose.Schema({
    client_id:{
        type : String,
      // required : "body is require",
        minlength:1,
        maxlength:150

    },
    whatsappno:{
        type : Number,
     //  required : "title is require",
        minlength:1,
        maxlength:150
    },
    message_count:{
      default:0,
        type : Number,
      // required : "body is require",
        minlength:0,
        maxlength:150

    },
    id:{
        type :String,
      // required : "body is require",
        minlength:1,
        maxlength:150
    }
    
});
module.exports=mongoose.model("whatsapp",postschema)