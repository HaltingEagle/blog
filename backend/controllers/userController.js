import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "3d"});
}

export const register = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const exists = await userModel.findOne({email})
        if(exists){
            return res.status(400).json({error: "User already exists"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({error: "Invalid email"});
        }
        if(password.length < 6){
            return res.status(400).json({error: "Password is not strong enough"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({username: username, email:email, password: hashedPassword});
        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({email: user.email, token: token, message: "Registered successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({error: "User does not exist"});
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({error: "Incorrect password"});
        }
        const token = createToken(user._id);
        res.status(200).json({email: user.email, token: token, message: "Logged in successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const changePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    try {
        const user = await userModel.findById(req.user.id);
        if(!user){
            return res.status(404).json({error: "User does not exist"});
        }
        const match = await bcrypt.compare(oldPassword, user.password);
        if(!match){
            return res.status(401).json({error: "Incorrect password"});
        }
        if(newPassword.length < 6){
            return res.status(400).json({error: "Password is not strong enough"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.findByIdAndUpdate(req.user.id, {password: hashedPassword});
        res.status(200).json({message: "Password changed"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if(!user){
            return res.status(404).json({error: "User does not exist"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const forgotPassword = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({error: "User does not exist"});
        }
        if (password.length < 6){
            return res.status(400).json({error: "Password is not strong enough. Try Again"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.findByIdAndUpdate(user._id, {password: hashedPassword});
        res.status(200).json({ message: "Password changed"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
