const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req,res)=>{

  const {name,email,password}=req.body;

  const exists =
  await User.findOne({email});

  if(exists){
    return res.status(400).json({
      message:'User exists'
    });
  }

  const hash =
  await bcrypt.hash(password,10);

  const user =
  await User.create({
    name,
    email,
    password:hash
  });

  res.status(201).json(user);
};

exports.login = async(req,res)=>{

  const {email,password}=req.body;

  const user =
  await User.findOne({email});

  if(!user){
    return res.status(401).json({
      message:'Invalid credentials'
    });
  }

  const valid =
  await bcrypt.compare(
    password,
    user.password
  );

  if(!valid){
    return res.status(401).json({
      message:'Invalid credentials'
    });
  }

  const token =
  jwt.sign(
    {
      id:user._id,
      role:user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:'1d'
    }
  );

  res.json({token});
};
