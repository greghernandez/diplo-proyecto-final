const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const server = require('../app');
const should = chai.should();
const sinon = require('sinon');
const payment = require('../controllers/payment.controller');
const PAYMENT_FILE_PATH = path.resolve('./payment-generated.txt');
const {Request, Response} = require('./mock');
const utils = require('./utils');
const {uniq} = require('lodash');
const Promise = require('bluebird');

chai.use(chaiHttp);

describe('payment check', () => {
    let req, res, next, agent, apiKey;

    beforeEach((done) => {
        agent = chai.request.agent(server);
        req = new Request();
        res = new Response();
        next = sinon.stub();

        utils.generatePaymentFile()
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
        utils.removeFile(PAYMENT_FILE_PATH)
          .then(() => done() )
    });

    it('Should generate an random price', (done) => {
        payment.create(req, res);
        utils.getFromFile(PAYMENT_FILE_PATH)
            .then(data => {
                data.length.should.eql(1);
                done();
            })
            .catch(err => {
                done(err);
            })
    });

    it('Should generate 5 random prices', done => {
        let n = 10;
        for (let i = 0; i < n; i++) {
            payment.create(req, res);
        }
        utils.getFromFile(PAYMENT_FILE_PATH)
            .then(data => {
                data.length.should.eql(n);
                const uniqKeys = uniq(data);
                uniqKeys.length.should.eql(data.length);
                done();
            })
    });


    it('Should return 5 promo codes', done => {
        chai.request(server)
            .get('/payment/promos')
            .set('x-api-key', apiKey)
            .then(promos => {
                promos.body.length.should.eql(5);
                done();
            })
            .catch(err => {
                done(err);
            })
    });

    it('Discount - Should discount an amount to prices', done => {
        payment.create(req, res)
        chai.request(server)
            .post('/payment/discount')
            .set('x-api-key', apiKey)
            .send({ discountAmount: 10 })
            .then(response => {
                console.log(response.body);
                response.body.data.should.be.a('array');
                response.should.have.status(200);
                done();
            })
            .catch(err => {
                done(err);
            })
    })
});
