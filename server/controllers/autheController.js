import bcrypt, { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import generateToken from '../utils/generateToken.js';

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    const {username, email, password}=req.body;
    try{
        const userExists=await prisma.user.findFirst({where:{OR:[{email},{username}]}})
    if(userExists){
        return res.status(400).json({message:'User already exist'})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const user =await prisma.user.create({
        data:{
            username,email,password:hashedPassword
        }
    })
    generateToken(res,user.id);
    res.status(201).json({
        id:user.id,username:user.username,email:user.email
    })
} catch(error){
    res.status(500).json({message:'Server error'})
}
}
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await prisma.user.findUnique({where:{email}})
        if (user && await bcrypt.compare(password,user.password)){
            generateToken(res,user.id)
            res.json({
                id:user.id,username:user.username,email:user.email
            })
        }else{
            res.status(401).json({message:'Invalid email or password'})
        }


    }catch (error) {
         res.status(500).json({ message: 'Server error' });
   
    }
}
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getUserProfile,registerUser, loginUser, logoutUser };