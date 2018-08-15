const chai = require('chai');
const chaihttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = require('chai').expect;

chai.use(chaihttp);

describe('Blogs', function() {
    before(function() {
        return runServer;
    });
    after(function() {
        return closeServer;
    });
    it('should list blogs on GET', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res).to.be.a('array');
        });
    });
    it('should add a blog on POST', function() {
        const newBlog = {title: 'How To Write A Blog', content: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.', author: 'Muffin'};
        return chai.request(app)
            .post('/blog-posts')
            .send(newBlog)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.include.keys('title', 'content', 'author');
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newBlog, {id: res.body.id}));
            });
    });
    it('should update a blog on PUT', function() {
        const updateData = {
            title: 'What is Lorem Ipsum?',
            content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            author: 'Shane McGinty'
        };
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData)
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                expect(res).to.deep.equal(updateData);
            });
    });
    it('should delete a blog on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            return chai.request(app)
                .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
});
