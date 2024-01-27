const router = require('express').Router();
const User = require('../models/User');

//home route
router.get('/', function(req, res){
    res.json("Welcome to Auth route");
});

//register
router.post('/register', async function(req, res){
    const user = new User(req.body);

    try{
        await user.save();
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err.message);
    }
});

//login
router.post('/login', async function(req, res){
    try {
        const user = await User.findOne({ username: req.body.username });
    
        // user not exists
        if (!user) {
          return res.status(404).json("User does not exist!");
        }
    
        // check password
        const isValid = user.password === req.body.password;
        if (!isValid) {
          return res.status(401).json("Password does not match!");
        }
    
        // all ok
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json(err.message);
      }
});






module.exports = router;