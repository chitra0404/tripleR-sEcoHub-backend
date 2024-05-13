const mongoose=require('mongoose');

const recyclerSchema=mongoose.Schema({
    recyclerID:{
        type:String,
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
       min:2,
    default:"recycler", },
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
    
    },
    city: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    assignedPickups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pickup' }] 

})

const Recycler=mongoose.model('recycler',recyclerSchema);
module.exports=Recycler;