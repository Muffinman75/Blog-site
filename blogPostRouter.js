const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Blogs, Author } = require('./models');

router.get('/', (req, res) => {
    Blogs.find()
    .limit(11)
    .then(blogs => {
        res.json({
            blogs: blogs.map(blog =>
            blog.serialize())
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/:id', (req, res) => {
    Blogs.findById(req.params._id)
        .then(blog => {
            res.json({
                id: blog._id,
                title: blog.title,
                content: blog.content,
                author: blog.authorName,
                comments: blog.comments
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'author_id'];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    Author.findById(req.body.author_id)
    .then(author => {
        if (author) {
            Blogs
                .create({
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.id
                })
                .then(blog => res.status(201).json({
                    id: blog.id,
                    author: `${author.firstName} ${author.lastName}`,
                    content: blog.content,
                    title: blog.title,
                    comments: blog.comments
                }))
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: 'Something went wrong' });
                });
          }
          else {
              const message = `Author not found`;
              console.error(message);
              return res.status(400).send(message);
          }
     })
     .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'something went horribly awry' });
     });

});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id must match'
        });
    }
    const toUpdate = {};
    const updateableFields = ['title', 'content'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Blogs.findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
    .then(updatedPost => res.status(200).json({
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content
    }))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
    Blogs.findByIdAndRemove(req.params.id)
    .then(blog => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found'});
});

module.exports = router;
