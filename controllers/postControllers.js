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
        let [val, _] = await Post.findByWork(req.body.work_id);
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
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.checkEligible = async (req, res, next) => {
    try {
        let obj = req.body;
        let [check,_] = await Post.checkEligible(obj);
        console.log(check.length);
        var invested;
        if(check.length == 0)
            invested = false;
        else
            invested = true;
        res.status(200).json({ invested });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getUpcoming = async (req, res, next) => {
    try {
        let [val, _] = await Post.getUpcoming();
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getCompleted = async (req, res, next) => {
    try {
        let [val, _] = await Post.getCompleted();
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.invest = async (req, res, next) => {
    try {
        let val = await Post.invest(req.body);
        let message = '';
        if (val == true)
            message = 'Investment Successful';
        else
            message = 'Investment Failed';
        res.status(200).json({ success: val, message: message });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.userLog = async (req, res, next) => {
    try {
        let [arr,_] = await Post.userLog(req.body);
        arr.forEach(val => {
            if( val.winning_team == val.winner){
                val.won_coins = "+"+val.coins* 2
            }
            else
                val.won_coins=val.coins*-1
        });
        res.status(200).json({arr});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.result = async (req, res, next) => {
    try {
        let val = await Post.result(req.body);
        let message = '';
        if (val == true)
            message = 'Investment Successful';
        else
            message = 'Investment Failed';
        res.status(200).json({ success: val, message: message });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.leaderboard = async (req, res, next) => {
    try {
        let [val,_] = await Post.leaderboard(req.body);
        res.status(200).json({ val});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

