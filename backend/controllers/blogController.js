import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";
const imageBlogPath = "blog_pic_6.png"
import fs from "fs";
export const createBlog = async (req, res) => {
    let image_filename = req.file ? req.file.filename : imageBlogPath;
    try {
        console.log(req.user.id);
        const user = await userModel.findById(req.user.id);
        if(!user){
            return res.status(404).json({error: "User does not exist"});
        }
        const newBlog = new blogModel(
            {
            userId: req.user.id,
            title: req.body.title,
            category: req.body.category,
            image: image_filename,
            content: req.body.content
            }
        );
        const blog = await newBlog.save();
        await userModel.findByIdAndUpdate(req.user.id, {$push: {articles: blog._id}});
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getBlogs = async (req, res) => {
    try{
        const blogs = await blogModel.find({});
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getBlogById = async (req, res) => {
    try{
        const blog = await blogModel.findById(req.params.id);
        res.status(200).json({blog});
    }catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getUserBlogs = async (req, res) => {
    try{
        const blogs = await blogModel.find({userId: req.user.id});
        res.status(200).json(blogs);
    }catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await blogModel.findById(blogId);
        if(!blog){
            return res.status(404).json({error: "Blog does not exist"});
        }
        if(blog.userId.toString() != req.user.id){
            return res.status(401).json({error: "Unauthorized"});
        }
        if(blog.image != imageBlogPath){
            fs.unlinkSync(`./uploads/${blog.image}`);
        }
        await userModel.findByIdAndUpdate(blog.userId, { $pull: { articles: blogId } });
        await blogModel.findByIdAndDelete(blogId);
        res.status(200).json({message: "Blog deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const {title, category, content} = req.body;
    const imageFile = req.file
    try {
        const blog = await blogModel.findById(blogId);
        if(!blog){
            return res.status(404).json({error: "Blog does not exist"});
        }
        if(blog.userId.toString() != req.user.id){
            return res.status(401).json({error: "Unauthorized"});
        }
        if(!title && !category && !content && !imageFile){
            return res.status(400).json({error: "Nothing to update"});
        }
        if(imageFile){
            fs.unlinkSync(`./uploads/${blog.image}`);
            await blogModel.findByIdAndUpdate(blogId, {image: imageFile.filename});
        }
        if(title){
            await blogModel.findByIdAndUpdate(blogId, {title: title});
        }
        if(category){
            await blogModel.findByIdAndUpdate(blogId, {category: category});
        }
        if(content){
            await blogModel.findByIdAndUpdate(blogId, {content: content});
        }
        res.status(200).json({message: "Blog updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}