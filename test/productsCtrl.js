const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../server/server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('productsCtrl', () => {

  it('expect true to equal true', (done) => {
    expect(true).to.equal(true);
    done();
  })

  it('expect false to not equal true', (done) => {
    expect(false).to.not.equal(true);
    done();
  })

  it('should get all products', (done) => {
    chai.request(server)
    .get('/api/products')
    .end((err, res) => {
      // console.log(res.body);
      expect(res).to.be.ok;
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');
      expect(res.body[0].name).to.equal('Pencil');
      done();
    })
  })

  // it('should get all cart items', (done) => {
  //   chai.request(server)
  //   .get('/api/cart')
  //   .end((err, res) => {
  //     // console.log(res.body);
  //     expect(res).to.be.okay;
  //     expect(res).to.have.status(404);
  //     expect(res.body).to.be.a('array');
  //     done();
  //   })
  // })

  it('should be unauthorized, cannot get to this page', (done) => {
    chai.request(server)
    .get('/me')
    .end((err, res) => {
      expect(res).to.be.okay;
      expect(res).to.have.status(401)
      done();
    })
  })

  it('should get all products in cart 2', (done) => {
    chai.request(server)
    .get('/api/in/cart/2')
    .end((err, res) => {
      expect(res.body).to.be.okay;
      expect(res).to.have.status(200);
      expect(res.body[0].id).to.equal(31);
      done();
    })
  })

  // it('should not be able to get user history', (done) => {
  //   chai.request(server)
  //   .get('/api/order/2')
  //   .end((err, res) => {
  //     expect(res).to.have.status(500);
  //     done();
  //   })
  // })

  it('should update product with id of 60', (done) => {
    chai.request(server)
    .put('/api/update/qty/60/3')
    .end((err, res) => {
      expect(res.body).to.be.okay;
      expect(res).to.have.status(200);
      done();
    })
  })

  it('should add product to cart', (done) => {
    chai.request(server)
    .post('/api/add/item/cart/3')
    .send({id: 3, qty: 1})
    .end((err, res) => {
      expect(res).to.be.okay;
      expect(res).to.have.status(200);
      done();
    })
  })



})
