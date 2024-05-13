const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    userId:{
type:String,
required:true,
    },
    name:{
        type:String,
        required:true,
        min:1,
        max:255,
    },
    email:{
        type:String,
        required:true,
        max:255
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"consumer",
       min:2, },
       isVerified:{
        type:Boolean,
      
        default:false
    },
    
    token_activate_account:{
        type:String
    },
    token_reset_password:{
        type:String
    },
    acc_create:{
        type: Date,
        default: Date.now
    }
})

const User=mongoose.model('user',UserSchema);
module.exports=User;