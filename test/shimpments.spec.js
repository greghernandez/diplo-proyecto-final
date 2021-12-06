const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const sinon = require('sinon');
const {Request, Response} = require('./mock');
const utils = require('./utils');
const SHIPMENT_FILE_PATH = 'shipment-generated.txt';

chai.use(chaiHttp);

describe('Shimpments tests', () => {
    let req, res, agent;
    let apiKey;

    beforeEach((done) => {
        agent = chai.request.agent(server);

        utils.generateFile(SHIPMENT_FILE_PATH)
            .then(() => {
                apiKey = utils.authenticate(agent).then((key) => {
                    apiKey = key;
                    agent.set('x-api-key', apiKey)
                    done();
                })
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
        utils.removeFile(SHIPMENT_FILE_PATH)
    });

    it('Get all - should return a list of shimpments', (done) => {
        chai.request(server)
            .post('/shipments')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.should.have.status(201);
                done();
            })
            .catch((err) => {
                done(err);
            })
    })

    it('Get one - should return a single shimpment', (done) => {
        chai.request(server)
            .post('/shipments')
            .set('x-api-key', apiKey)
            .then((response) => {
                if (response.body.data) {
                    chai.request(server)
                        .get(`/shipments/${response.body.data.id}`)
                        .set('x-api-key', apiKey)
                        .then((response) => {
                            response.body.data?.should.be.a('object');
                            response.should.have.status(200);
                            done();
                        })
                        .catch((err) => {
                            done(err);
                        })
                } else {
                    done();
                }
            })
    })

    it('Create - should create a new shimpment', (done) => {
        chai.request(server)
            .post('/shipments')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.body.data?.should.be.a('object');
                response.should.have.status(201);
                done();
            })
            .catch((err) => {
                done(err);
            })
    })

    it('Change status - should update a shimpment status', (done) => {
        chai.request(server)
            .post('/shipments')
            .set('x-api-key', apiKey)
            .then((response) => {
                response.should.have.status(201);
                if (response.body.data) {
                    chai.request(server)
                        .patch('/shipments/' + response.body.data.id)
                        .set('x-api-key', apiKey)
                        .send({ status: 'delivered' })
                        .then((response) => {
                            response.body.data?.should.be.a('object');
                            response.should.have.status(201);
                            done();
                        })
                        .catch((err) => {
                            done(err);
                        })
                } else {
                    done('No data in response');
                }
            })
    })
})