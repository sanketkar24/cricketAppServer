const jwt = require('jsonwebtoken');
require("dotenv").config();
const Post = require('../models/Post');
// exports.getAllPosts = async (req,res,next) =>{
//     try{
//         const [posts,_] = await Post.findAll();
//         res.status(200).json({count: posts.length, posts})
//     }catch(error){
//         console.log(error);
//         next(error);
//     }
// }
// exports.createNewPost = async(req, res, next) =>{
//    try {
//     let { title, body } = req.body;
//     let post = new Post(title, body);
//     post = await post.save();
//     res.status(201).json({message: "Post created"})
//    } catch (error) {
//     console.log(error);
//     next(error);
//    }
// }

// exports.getPostById = async(req,res,next) =>{
//     try {
//         let postId = req.params.id;
//         let [post, _] = await Post.findById(postId);
//         res.status(200).json({ post: post[0] });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }
exports.regUser = async (req, res, next) => {
    try {
        let obj = req.body;
        let val = await Post.register(obj);
        if (val != 1) val = 0;
        return res.json({
            success: val
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.login = async (req, res, next) => {
    try {
        let obj = req.body;
        let result = await Post.login(obj.username, obj.password);
        console.log("token: " + result)
        if (result == null) {
            sucvar = 0;
            msg = "WRONG USERNAME PASSWORD"
        }
        else {
            sucvar = 1;
            msg = "Login successful"
        }
        return res.json({
            success: sucvar,
            message: msg,
            token: result
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.reset = async (req, res, next) => {
    try {
        let obj = req.body;
        let result = await Post.reset(obj.username, obj.password, obj.newpassword);
        return res.json({
            result: result
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.findPeopleByID = async (req, res, next) => {
    try {
        let [val,_] = await Post.findByWork(req.body.work_id);
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.findMovieDetailsByID = async (req, res, next) => {
    try {
        Post.findMovieByID(req.body.movie_id);
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getUser = async (req, res, next) => {
    try {
        let obj = req.body;
        let [val, _] = await Post.getUser(obj);
        res.status(200).json({val});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getUpcoming = async (req, res, next) => {
    try {
        let [val,_] = await Post.getUpcoming();
        res.status(200).json({val});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getCompleted = async (req, res, next) => {
    try {
        let [val,_] = await Post.getCompleted();
        res.status(200).json({val});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
