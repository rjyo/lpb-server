var should = require('should')
  , request = require('supertest')
  , step = require('step')
  , app = require('../app');

// Infomation
// http://stackoverflow.com/questions/11927196/supertest-custom-express-server-in-node
// https://github.com/visionmedia/supertest

describe('User API',function(){

  it('GET /api/create/:board should return 200',function(done){
    request(app)
      .get('/api/create/testboard')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('game_id');
        if (!err) done();
      });
  });

  it('GET /api/list should return 200',function(done){
    request(app)
      .get('/api/list')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var list = res.body;
        list.should.be.an.instanceOf(Array);
        if (!err) done();
      });
  });

  it('GET /api/join/:game_id without header should return 401',function(done){
    request(app)
      .get('/api/join')
      .expect(401, done);
  });

  it('GET /api/join/:game_id should return 404',function(done){
    request(app)
      .get('/api/join')
      .set('x-lpb-client_id', 'CLIENT_ID')
      .set('x-lpb-game_id', 'abc')
      .expect(404, done);
  });

  it('GET /api/join/:game_id should return 200',function(done){
    step(
      function() {
        request(app)
          .get('/api/list')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(this);
      },
      function(err, res) {
        var list = res.body;
        list.length.should.be.above(0);
        var gameId = list[0];

        request(app)
          .get('/api/join')
          .set('x-lpb-client_id', 'CLIENT_ID')
          .set('x-lpb-game_id', gameId)
          .expect(200, done);
      }
    );
  });

});
