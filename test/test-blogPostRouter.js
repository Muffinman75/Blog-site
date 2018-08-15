const chai = require('chai');
const chaihttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

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
});
