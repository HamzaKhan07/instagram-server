const router = require('express').Router();
const User = require('../models/User');

//home route
router.get('/', function(req, res){
    res.json("Welcome to User route");
});

//get user
router.get('/:username', async function(req, res){
    const user = await User.findOne({ username: req.params.username });
    return res.status(200).json(user);
      
  });

//get user
router.get('/id/:id', async function(req, res){
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
      
  });

//update user
router.put('/update/:id', async function(req, res){
    const user = User.findById(req.params.id);

    if(req.params.id === req.body.userId){
        await user.updateOne({profilePicture: req.body.profilePicture, description: req.body.description});
        res.status(200).json("User updated successfully!");
    }
    else{
        res.status(500).json("You can only update your account!");
    }
});

//follow user
router.put('/follow/:username', async function(req, res){
    const currUser = await User.findById(req.body.userId);
    const otherUser = await User.findOne({username: req.params.username});

    if(!otherUser.followers.includes(currUser._id)){
        await otherUser.updateOne({$push: {followers: currUser._id}});
        await currUser.updateOne({$push: {following: otherUser._id}});

        res.status(200).json("User followed successfully!");
    }
    else{
        res.status(500).json("You already followed this user!");
    }
});

//unfollow user
router.put('/unfollow/:username', async function(req, res){
    const currUser = await User.findById(req.body.userId);
    const otherUser = await User.findOne({username: req.params.username});

    if(otherUser.followers.includes(currUser._id)){
        await otherUser.updateOne({$pull: {followers: currUser._id}});
        await currUser.updateOne({$pull: {following: otherUser._id}});

        res.status(200).json("User unfollowed successfully!");
    }
    else{
        res.status(500).json("You do not follow this user!");
    }
});

//get all users
router.get('/allUsers/all', async function(req, res){
    try{
        const users = await User.find({});
        console.log("users:"+users);
        return res.status(200).json(users);
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;