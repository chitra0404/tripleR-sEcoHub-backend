const Query= require('../models/QueryModel')

module.exports.addquery=async (req, res) => {
    try {
        const {title,description,type,recycler}=req.body;
    
      const query = new Query({title,description,type,recycler});
      console.log(query)
      await query.save();
      res.status(201).send('Complaint submitted successfully');
    } catch (error) {
      res.status(500).send('Error submitting complaint');
    }
  };

  module.exports.getquery=async(req,res)=>{
    try{
        const query=await Query.find()
        res.status(200).send({ status: "200", message: query });
    } catch (error) {
      console.log(error);
      res.status(200).send({ status: "500", message: error });
    }
}
