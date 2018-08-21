const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Blogs } = require('./models');

router.get('/blogs', (req, res) => {
    Blogs.find().limit(3)
        .then(blogs => {
            res.json({
                blogs: blogs.map(blog =>
                blog.serialize())
            });
        })
        .catch(err => {
            console.log(err);
            rres.status(500).json({ message: 'Internal server error'});
        });
});

router.get('/blogs/:id', (req, res) => {
    Blogs.findById(req.params.id)
        .then(blog => res.json(blog.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
        });
});

router.post('/blogs', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Blogs.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    })
        .then(blog => res.status(201).json(blog.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Internal server error'});
        });
});

router.put('/blogs/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = `Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({ message: message});
    }
    const toUpdate = {};
    const updateableFields = ['title', 'content', 'author'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Blogs.findByIdAndUpdate(req.params.id, { $set: toUpdate})
    .then(blog => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.delete('/blogs/:id', (req, res) => {
    Blogs.findByIdAndRemove(req.params.id)
    .then(blog => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found'});
});

module.exports = router;
