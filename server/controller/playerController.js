const Player = require("../model/player")

exports.allPlayer = async(req,res,next)=>{
  try{
    const allPlayer = await Player.find()
    console.log(allPlayer)
    res.status(200).json(allPlayer)

  }catch(err){
    res.status(500).json(err)
  }
}