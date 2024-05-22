const mongoose=require('mongoose');

const contentListSchema=mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        type:String,
    },
    link:{
        type:String,
    }
})

const ContentList=mongoose.model('content',contentListSchema);
module.exports=ContentList;
