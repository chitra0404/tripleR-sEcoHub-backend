const mongoose=require('mongoose');
const pickupSchema= mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        
    },
    pickupID:{
type:String,

    },

    category:{
        type:String,
    },
    city:{
        type:String,
        required:true,
        min:5,
    },
    state:{
        type:String,
        required:true,
        default:"Tamilnadu"
    },
    address:{
        type:String,
        required:true,
},
othernumber:{
    type:Number,

},
items:{
type:String,
},
date:{
    type:Date,
    default:Date.now
},
recycler:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recycler',
    
},

status:{
    type:String,
    enum:['pending','confirmed','cancelled'],
    default:"pending"
}
},{timestamps:true})

const Pickup=mongoose.model('pickup',pickupSchema);
module.exports=Pickup;