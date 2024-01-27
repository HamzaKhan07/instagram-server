const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CommentSchema = Schema({
    profilePicture: {type: String},
    username: {type: String},
    comment: {type: String},
}, {timestamps: true});

const PostSchema = Schema({
    userId: {type: String},
    image: {type: String},
    description: {type: String},
    likes: {type: Array, default: []},
    comments: {type: [CommentSchema], default: []}
}, {timestamps: true});

const Post = model('Post', PostSchema);

module.exports = Post;