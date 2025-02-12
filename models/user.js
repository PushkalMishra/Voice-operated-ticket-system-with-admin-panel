const mongoose=require('mongoose');
const Schema=mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        require:true,
        unique:true,
        type:String
    },
    isAdmin: { 
        required:true,
        type: Boolean, 
        default: false 
    },
});

UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',UserSchema)
