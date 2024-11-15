import commentModel from "../models/commentModel.js";
import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
export const createComment = async (req, res) => {
    let image_filename = req.file ? req.file.filename : "";
    try {
        const user = await userModel.findById(req.user.id);
        if(!user){
            return res.status(404).json({error: "User does not exist"});
        }
        const blog = await blogModel.findById(req.params.id);
        if(!blog){
            return res.status(404).json({error: "Blog does not exist"});
        }
        const newComment = new commentModel(
            {
            userId: req.user.id,
            blogId: req.params.id,
            text: req.body.text,
            image: image_filename
            }
        );
        const comment = await newComment.save();
        await blogModel.findByIdAndUpdate(req.params.id, {$push: {comments: comment._id}});
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getComments = async (req, res) => {
    try{
        const comments = await commentModel.find({});
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getCommentsByBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await blogModel.findById(id);
        if(!blog){
            return res.status(404).json({error: "Blog does not exist"});
        }
        const comments = await commentModel.find({blogId: id});
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await commentModel.findById(commentId);
        if(!comment){
            return res.status(404).json({error: "Comment does not exist"});
        }
        if(comment.userId.toString() != req.user.id){
            return res.status(401).json({error: "Unauthorized"});
        }
        if(comment.image != ""){
            fs.unlinkSync(`./uploads/${comment.image}`);
        }
        await blogModel.findByIdAndUpdate(comment.blogId, { $pull: { comments: commentId } });
        await commentModel.findByIdAndDelete(commentId);
        res.status(200).json({message: "Comment deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const deleteCommentsByBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await blogModel.findById(blogId);
        if(!blog){
            return res.status(404).json({error: "Blog does not exist"});
        }
        if(blog.userId.toString() != req.user.id){
            return res.status(401).json({error: "Unauthorized"});
        }
        const comments = await commentModel.find({blogId});
        for (let comment of comments) {
            await commentModel.findByIdAndDelete(comment._id);
            if(comment.image != ""){
                fs.unlinkSync(`./uploads/${comment.image}`);
            }
        }
        await blogModel.findByIdAndUpdate(blogId, {comments: []});
        res.status(200).json({message: "Comments deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
