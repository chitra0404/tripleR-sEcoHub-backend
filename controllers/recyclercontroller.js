const Recycler=require("../models/recyclerModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const{NodeMailer}=require("../nodemailer/mailer")


module.exports.getrecycler=async(req,res)=>{
    try{
        const recycler=await Recycler.find()
        res.status(200).send({ status: "200", message: user });
    } catch (error) {
      console.log(error);
      res.status(200).send({ status: "500", message: error });
    }
}

module.exports.RecyclerRegister=async(req,res)=>{
    try{

    const {name,email,password,role}=req.body;
   
    const emailexist=await Recycler.findOne({email:req.body.email})
    if(emailexist){
        res.status(400).json({
            status: "400",
            message: "This email is already in use",
          });
          return;
    }
    const hashedpassword=await bcrypt.hash(password,10);
    
    const token = jwt.sign(
        { email },
        process.env.R_KEY
      );
    const recycler=new Recycler( { name,email,role:"recycler", password: hashedpassword,token, isVerified:false });
 
    await recycler.save();
    res.status(200) .header("auth-token").json({token:token});
    const randomString =
Math.random().toString(36).substring(2, 15) +
Math.random().toString(36).substring(2, 15);

const link = `${process.env.LINK}/acc/${randomString}`;

const sub = "Account Activation"

NodeMailer(randomString, email, link,  sub);
    } catch (err) {
        console.error('Error signing up user', err);
        return res.status(400).json({ Message: "Internal server error" })
    }

}

module.exports.AccActivation = async (req, res) => {

    // try {
        console.log(req.params.id);
        const tok  = req.params.id;
console.log("token",tok);
        const recycler = await Recycler.findOne({ token_activate_account: tok });

        if (!recycler) {
            return res.status(400).json({ Message: "User not found or Activated account" });
        }

        recycler.isVerified = true

        recycler.token_activate_account = "Account Activated";

        const updated = await Recycler.findByIdAndUpdate(recycler._id, recycler);

        if (updated) {
            return res.status(201).json({ Message: "Account activated" });
        }
    // }
    // catch (err) {
    //     console.error('Error signing up user', err);
    //     return res.status(400).json({ Message: "Internal server error" })
    // }
}

module.exports.checkAct = async (req, res) => {
    try {
      const { id } = req.params;
      const recycler = await Recycler.findOne({ token_activate_account: id });
  
      if (!recycler) {
        return res.status(400).json({ Message: "User not found or account already activated" });
      }
  
      const activated = recycler.isVerified;
  
      return res.status(200).json({ activated });
    } catch (err) {
      console.error('Error checking account activation', err);
      return res.status(500).json({ Message: "Internal server error" });
    }
  };
module.exports.RecycleLogin=async(req,res)=>{
    const {email,password}=req.body;
    const recycler=await Recycler.findOne({email});
    if(!recycler){
        return res.status(409).json({message:"authentication failed"});
    }
        const passwordmatch=await bcrypt.compare(password,recycler.password);
        if(!passwordmatch){
            return res.status(409).json({message:"invalid password"}); }
            if(recycler.isVerified){
                const role=recyler.role;
                const token=jwt.sign({ email},process.env.R_KEY,{expiresIn:'24hr'})
                return res.status(200).json({token,role});
            }
            else{
                return res.status(400).json({ message: 'Account not activated' });
            }
    
}

