const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = Schema({
    'username': {type: String, unique: true, required: true},
    'password': {type: String, minLength: 6, required: true},
    'profilePicture': {type: String},
    'description': {type: String},
    'followers': {type: Array, default: []},
    'following': {type: Array, default: []}
}, {timestamps: true});

const User = model('User', userSchema);

module.exports = User;