const express = require('express');
const router = express.Router();


const {Blogs} = require('./models');

Blogs.create('Blog-1', 'Hi, this is my Blog. It\'s mostly about Blogs about Blogs. Blogs, Blogs, Blogs.', 'By Muffinman');
Blogs.create('Blog-2', 'Another Blog, This one\'s about me live Blogging on the current Blogosphere. Happy Blogging Bloggers!', 'By Muffinman');

router.get('/', (req, res) => {
    res.json(Blogs.get());
});

router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = Blogs.create(
        req.body.title,
        req.body.content,
        req.body.author
    );
    res.status(201).json(item);
});

router.put("/:id", (req, res) => {
    const requiredFields = ["id", "title", "content", "author"];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${
            req.params.id
        }) and request body id ``(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    Blogs.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
});

router.delete("/:id", (req, res) => {
    Blogs.delete(req.params.id);
    console.log(`Deleted blog post with id \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;
