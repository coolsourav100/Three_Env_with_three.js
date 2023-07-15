const User = require('../model/user')
const Player = require('../model/player')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10;
require('dotenv').config()

const generateToken =(userId)=>{
  let token = jwt.sign({userId:userId},process.env.SALTKEY)
  return token
}

exports.userLogin= async(req,res,next)=>{
  
  try{
    const existUser =await User.findOne({email:req.body.email})
    const player = await Player.findOne({user:existUser._id})
    
    if(existUser){
      let match = await bcrypt.compare(req.body.password , existUser.password)
      if(match){
        
        res.status(200).json({response:"UserLoggedIn",token:generateToken(existUser._id) ,playerId:player._id})

      }else{
        res.status(401).json('User Not Authorizes!')
      }

    }else{
      res.status(400).json('User does not exists')
    }
  }catch(err){
    res.status(500).json(err)
  }

}


exports.userRegister= async(req,res,next)=>{
  

  try{
    const existUser = await User.findOne({email:req.body.email})
    console.log(existUser)
    if(!existUser){

      bcrypt.hash(req.body.password , saltRounds ,async(err, hash)=>{
  
        const user =new User({name:req.body.name , email:req.body.email , password:hash})
        const player = await Player({ user: user._id, position:[0,0,0], rotation:0});
        player.save();
        user.save()
        res.status(200).json('User Create')
      })
    }else{
      res.status(401).json('User alredy Exists')
    }
  }catch(err){
    res.status(500).json(err)
  }

}