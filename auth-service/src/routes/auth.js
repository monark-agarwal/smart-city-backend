const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const router = express.Router();
router.post('/register', async (req,res)=>{try{const {name,email,password,role}=req.body;const hashed=await bcrypt.hash(password,10);const user=await User.create({name,email,password:hashed,role});res.json({id:user.id,email:user.email,role:user.role})}catch(err){res.status(500).json({error:err.message})}});
router.post('/login', async (req,res)=>{try{const {email,password}=req.body;const user=await User.findOne({where:{email}});if(!user) return res.status(401).json({error:'User not found'});const valid=await bcrypt.compare(password,user.password);if(!valid) return res.status(401).json({error:'Invalid password'});const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'12h'});res.json({token})}catch(err){res.status(500).json({error:err.message})}});
module.exports=router;
