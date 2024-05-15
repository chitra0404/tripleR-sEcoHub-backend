const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const bodyparser=require("body-parser");
const route=require("./router/routes")

require('dotenv').config();

const app=express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors({
    origin: '*'
  }));
app.use(express.json());
app.use("/api",route);






 

 




const url=process.env.URL;

mongoose.connect(url)
.then(()=>console.log("connected to Mongodb"))
.catch(err=>console.log("error occurred",err));

const port=process.env.PORT||5003;
app.listen(port,()=>console.log(`listening to the ${port}`));