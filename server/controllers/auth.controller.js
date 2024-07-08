import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
export const register = async (req,res) => {
    const {username,password ,email} = req.body;
    try {
        // hashing the password
        const hashed_password = await bcrypt.hash(password,10);
        // register an user and save to the db
        const register_user = await prisma.user.create({
            data:{ ...req.body, password:hashed_password }
        })

        if(!register_user){
            return res.status(400).json({message:"Unable to register User"})
        }
        console.log(register_user);
        return res.status(200).json({message:"User Registered Successfully"});
    } catch (error) {
        return res.status(400).json({message:"Unable to register User"+error.message});    
    }
}

export const login = async (req,res) => {
    const {username, password} = req.body;
    try {
        // check if user exists
        const search_user = await prisma.user.findUnique({
            where:{
                username
            }
        });
        if(!search_user){
            return res.status(400).json({message:"User does not exist"});
        }
        // Checking the password
        const chk_pass = bcrypt.compare(password,search_user.password);
        if(!chk_pass){
            return res.status(400).json({message:"Invalid Password"});
        }
        const age = 7*24*60*60*1000;
        const token = jwt.sign({ userid:search_user.id,email:search_user.email,username:search_user.username },process.env.JWT_SECRET_KEY,{
            expiresIn:age,  
        })
        res.cookie("JWT",token,{
            httpOnly:true,
            maxAge:age,
            secure:false
        })
        return res.status(200).json({message:"LogegedIn successfully",search_user});
    }catch (err) {
        return res.status(400).json({message:"Unable to login User"+err.message});
    }
}

export const logout_user = (req,res) =>{
    res.cookie("JWT",null,{
        httpOnly:true,
        expires:new Date(0),
        secure:false,
        maxAge:0
    })

    return res.status(200).json({message:"Logged Out Successfully"});
}