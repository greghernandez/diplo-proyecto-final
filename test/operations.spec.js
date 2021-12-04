const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const sinon = require('sinon');
const {Request, Response} = require('./mock');
const utils = require('./utils');

chai.use(chaiHttp);

describe('operations endpoints test', () => {
    let req, res, agent;
    let apiKey;

    beforeEach((done) => {
        agent = chai.request.agent(server);
        console.log('beforeEach', agent);

        apiKey = utils.authenticate(agent).then((key) => {
            apiKey = key;
            agent.set('x-api-key', apiKey)
            done();
        })
    });

    afterEach((done) => {
        if (agent) {
            agent.close();
        }
        utils.clearKeysFile()
            .then(() => {
                done();
            })
    });

    it('Sum', (done) => {
        chai.request(server)
            .get('/operations/sum/5/8')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.should.have.status(200);
                response.body.result.should.be.a('number');
                response.body.result.should.equal(13);
                done();
            })
            .catch((err) => {
                done(err);
            })
    })

    it('Subtract', (done) => {
        chai.request(server)
            .get('/operations/subtract/10/2')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.should.have.status(200);
                response.body.result.should.be.a('number');
                response.body.result.should.equal(8);
                done();
            })
            .catch((err) => {
                done(err);
            })
    })

    it('Multiply', (done) => {
        chai.request(server)
            .get('/operations/multiply/2/6')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.should.have.status(200);
                response.body.result.should.be.a('number');
                response.body.result.should.equal(12);
                done();
            })
            .catch((err) => {
                done(err);
            })
    })

    it('Divide', (done) => {
        chai.request(server)
            .get('/operations/divide/10/2')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.should.have.status(200);
                response.body.result.should.be.a('number');
                response.body.result.should.equal(5);
                done();
            })
            .catch((err) => {
                done(err);
            })
    })
})