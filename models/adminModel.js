const mongoose=require("mongoose");

const adminSchema=mongoose.Schema({
   

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"Admin",
    }
})

module.exports=mongoose.model("Admin",adminSchema);