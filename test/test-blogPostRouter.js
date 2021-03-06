const chai = require('chai');
const chaihttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaihttp);

describe('Blogs', function() {
    before(function() {
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should list blogs on GET', function() {
        return chai.request(app)
        .get('/blogs')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            // expect(res).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            res.body.forEach(function(blog) {
                expect(blog).to.be.a('object');
                expect(blog).to.have.all.keys('title', 'content', 'author', 'id', 'publishDate');
            });
        });
    });
    it('should add a blog on POST', function() {
        const newBlog = {title: 'How To Write A Blog', content: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.', author: 'Muffin'};
        return chai.request(app)
            .post('/blogs')
            .send(newBlog)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.have.all.keys('id', 'title', 'content', 'author', 'publishDate');
                expect(res.body.id).to.not.equal(null);
                expect(res.body.title).to.equal(newBlog.title);
                expect(res.body.content).to.equal(newBlog.content);
                expect(res.body.author).to.equal(newBlog.author);
            });
    });
    it('should update a blog on PUT', function() {
        return chai.request(app)
            .get('/blogs')
            .then(function(res) {
                const updateData = Object.assign(res.body[0], {
                    title: 'What is Lorem Ipsum?',
                    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
                });
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blogs/${updateData.id}`)
                    .send(updateData)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    it('should delete a blog on DELETE', function() {
        return chai.request(app)
        .get('/blogs')
        .then(function(res) {
            return chai.request(app)
                .delete(`/blogs/${res.body[0].id}`);
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
});
