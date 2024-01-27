const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');

app = express();

//initialize databse
mongoose.connect('mongodb+srv://hamzakhan48208:RYOZ9zArZOEakQZV@cluster0.j0t3f3s.mongodb.net/?retryWrites=true&w=majority');

//middlewares
app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);


//home route
app.get('/', function(req, res){
    res.json("Welcome to Server!");
});

app.listen(4000, function(){
    console.log('listening on port 4000');
});