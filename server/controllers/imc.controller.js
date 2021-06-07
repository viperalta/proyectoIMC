const { Imc } = require("../models/imc.model");
const { User } = require("../models/user.model");

module.exports.createImc=async(request,response)=>{
    try{
        const {altura,peso,userId}=request.body;

        const imcnumber=(peso/(altura*altura))*10000;

        const imc=new Imc({altura,peso,imc:imcnumber});
        
        await imc.save();
        User.findOneAndUpdate(
            { _id: userId},
            { $push: { imcs: imc } },
            { new: true }
          ) 
          .then(res => response.json(res))
          .catch(err => response.json(err))
    }
    catch (err) {
        console.error(err);
        response.status(500).json(err);
    }
    
}

module.exports.pullImc = (request, response) => {

    const {userId,imcId}=request.body;
    
    User.findOneAndUpdate(
        { _id: userId},
        { $pull: { imcs: {_id: imcId} } },
        { new: true }
      ) 
      .then(deleteConfirmation => response.json(deleteConfirmation))
      .catch(err => response.json(err))

}