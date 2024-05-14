const mongoose=require('mongoose');

const PriceListSchema=mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        type:String,
    },
    price:{
        type:String,
    }
})

const PriceList=mongoose.model('priceList',PriceListSchema);
module.exports=PriceList;
