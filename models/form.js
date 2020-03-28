const mongoose=require('mongoose')
const postschema=new mongoose.Schema({
    firstname:{
        type : String,
        required : "firstname is require",
        minlength:4,
        maxlength:150
    },
    lastname:{
        type : String,
        required : "lastname is require",
        minlength:4,
        maxlength:150

    },
    email:{
        type : String,
        required : "email is require",
        minlength:4,
        maxlength:150
    },
    number:{
        type : Number,
     required : "number is require",
        minlength:4,
        maxlength:150

    },
    username:{
        type : String,
       required : "username is require",
        minlength:4,
        maxlength:150
    },
    password:{
        type : String,
       required : "password is require",
        minlength:4,
        maxlength:150

    },
    image:{
        type : String,
       required : "image is require",
        minlength:4,
        maxlength:150
    },
    gender:{
        type : String,
       required : "gender is require",
        minlength:4,
        maxlength:150

    },
    counters:[{
        daycount:String,
        date:String
    }]
});
module.exports=mongoose.model("whatsappserviceprovider",postschema)