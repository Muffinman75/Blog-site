'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const uuid = require('uuid');

const blogSchema = mongoose.Schema({
    title: { type: string, required: true },
    content: { type: string, required: true },
    author: {
        firstName: string,
        lastName: string,
        required: true
    }
});

blogSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName
    };
};

const Blogs = mongoose.model('Blogs', blogSchema);

module.exports = { Blogs };
