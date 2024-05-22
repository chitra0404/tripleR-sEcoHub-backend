const ContentList=require('../models/contentModel');
const {content}=require('../Data/content');

module.exports.getContent=async(req,res)=>{
    try{
        const cont=await ContentList.find();
        res.json(cont)
    }
    catch(err){
        res.status(500).json({err})
    }
}

const addcontentList=async()=>{
    try{
await ContentList.deleteMany();
await ContentList.insertMany(content);
    }
    catch(err){
console.log("error",err)
    }
}
addcontentList();

