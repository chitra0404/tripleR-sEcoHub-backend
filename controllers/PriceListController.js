const PriceList=require('../models/PricelistModel');
const {data}=require('../Data/data');

module.exports.getPrice=async(req,res)=>{
    try{
        const price=await PriceList.find();
        res.json(price)
    }
    catch(err){
        res.status(500).json({err})
    }
}

const addPriceList=async()=>{
    try{
await PriceList.deleteMany();
await PriceList.insertMany(data);
    }
    catch(err){
console.log("error",err)
    }
}
addPriceList();

