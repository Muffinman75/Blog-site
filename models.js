'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const uuid = require('uuid');

const commentSchema = ({ content: 'string'});

//const timeStamps = ({ timestamps:  true });

const authorSchema = ({
    firstName: { type: String },
    lastName: { type: String },
    userName: {
        type: 'string',
        unique: true
    }
});

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    //created: { type: Date, default: Date.now },
    comments: [commentSchema]
    // created: new Date()
});

blogSchema.pre('find', function(next) {
    this.populate('author');
    next();
});

blogSchema.pre('findOne', function(next) {
    this.populate('author');
    next();
});

blogSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName,
        comments: this.comments,
        //created: this.date
    };
};

const Author = mongoose.model('Author', authorSchema);
// third arg in Blogposts is collection name
const Blogs = mongoose.model('Blogs', blogSchema, 'blogposts');

module.exports = { Blogs, Author };
