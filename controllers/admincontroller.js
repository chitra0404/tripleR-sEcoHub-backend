const Admin=require("../models/adminModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();


module.exports.getAdmin=async(req,res)=>{
    try{
        const admin=await Admin.find();
        res.status(200).send({ status: "200", message: admin });
    }
    catch(err){
        res.status(500).send({ status: "500", message: err });

    }

}

module.exports.adminRegister=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingAdmin=await Admin.findOne({email:req.body.email});
       
        if(existingAdmin){
            res.send({message:"admin already exists in this email"})
        }
        
        else{
            let hashedPassword=await bcrypt.hash(password,10);
            const token=jwt.sign({email},process.env.ADMIN_KEY);

            const adm=new Admin({name,email,role:"admin",password:hashedPassword  })
            await adm.save();
            res.status(200) .header("auth-token").json({token:token});
        }
    }
    
    catch(err){
        res.send({message:err});
    }
}


module.exports.admninLogin=async(req,res)=>{
    const {email,password}=req.body;
    const admin=await Admin.findOne({email});
    if(!admin){
        return res.status(409).json({message:"authentication failed"});
    }
        const passwordmatch=await bcrypt.compare(password,admin.password);
        if(!passwordmatch){
            return res.status(409).json({message:"invalid password"}); }
            if (admin && passwordmatch) {
                const token=jwt.sign({ email},process.env.ADMIN_KEY,{expiresIn:'24hr'})
                res.json({
                 
                  
                  email: admin.email,
                 token:token
                })}
            else{
                return res.status(400).json({ message: 'invalid password' });
            }
        }