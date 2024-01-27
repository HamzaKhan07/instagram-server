const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//home route
router.get('/', function(req, res){
    res.json("Welcome to Post route!");
});

//create post
router.post('/create', async function(req, res){
    const post = new Post(req.body);

    try{
        await post.save();
       return  res.status(200).json("Post created successfully!");
    }catch(err){
        return res.status(500).json(err.message);
    }
});

//get post
router.get('/getPost/:postId', async function(req, res){
    try{
        const post = await Post.findById(req.params.postId);
        return res.status(200).json(post);
    }catch(err){
        return res.status(500).json(err);
    }
});

//update post
router.put('/update/:id', async function(req, res){
    const post = await Post.findById(req.params.id);

    if(post.userId === req.body.userId){
        try{
            if(post.image !== req.body.image){
                //image updated, update both
                await post.updateOne({image: req.body.image, description: req.body.description});
            }
            else{
                //image same, only update description
                await post.updateOne({description: req.body.description});
            }
            return res.status(200).json("Post updated successfully!");
        }catch(err){
            return res.status(500).json(err.message);
        }
    }
    else{
        return res.status(500).json("You are not the author!");
    }
});

//delete post
router.delete('/delete/:id', async function(req, res){
    const post = await Post.findById(req.params.id);
    
    try{
        await post.deleteOne();
        return res.status(200).json("Post deleted successfully!");
    }catch(err){
        console.log(err.message);
        return res.status(500).json(err.message);
    }
});

//like and dislike post
router.put('/like/:id', async function(req, res){
    //not liked previously
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("Post liked successfully!");
        }
        else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("Post disliked successfully!");
        }
    }catch(err){
        res.status(200).json(err.message);
    }

});

//get timeline posts
router.get('/timeline/all/:username', async function(req, res){
    try{
        const user = await User.findOne({username: req.params.username});
        const userPosts = await Post.find({userId: user._id});

        //get followings posts
        const friendsPosts = await Promise.all(
            user.following.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );

        res.status(200).json(userPosts.concat(...friendsPosts));
    }
    catch(err){
        res.status(500).json(err.message);
    }
    
});

//get timeline posts of current user
router.get('/timeline/:username', async function(req, res){
    try{
        const user = await User.findOne({username: req.params.username});
        const userPosts = await Post.find({userId: user._id});


        res.status(200).json(userPosts);
    }
    catch(err){
        res.status(500).json(err.message);
    }
});

//add comment
router.post('/addComment/:postId', async function(req, res){
    try{
        const post = Post.findById(req.params.postId);
        await post.updateOne({$push: {comments: req.body}});

        res.status(200).json("Comment added successfully!");

    }catch(err){
        res.status(500).json(err.message);
    }
});

module.exports = router;