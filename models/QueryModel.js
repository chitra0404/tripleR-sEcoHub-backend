const mongoose=require('mongoose');

const  QuerySchema=mongoose.Schema({
    recycler:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recycler',
        
    },
    title: String,
    type: String,
    description: String,
})
const Query=mongoose.model('Query',QuerySchema);
module.exports=Query;