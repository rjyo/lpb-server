var should = require('should')
  , request = require('supertest')
  , app = require('../app');

// Infomation
// http://stackoverflow.com/questions/11927196/supertest-custom-express-server-in-node
// https://github.com/visionmedia/supertest

var gameId;

describe('User API', function(){

  it('GET /api/create/:board should return 200', function(done){
    request(app)
      .get('/api/create/testboard')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('game_id');
        if (!err) done();
      });
  });

  it('GET /api/list should return 200', function(done){
    request(app)
      .get('/api/list')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var list = res.body;
        list.should.be.an.instanceOf(Array);
        gameId = list[0];
        if (!err) done();
      });
  });

  // Precondition Failed
  it('GET /api/join/:game_id without header should return 406', function(done){
    request(app)
      .get('/api/join')
      .expect(406, done);
  });

  it('GET /api/join/:game_id should return 404', function(done){
    request(app)
      .get('/api/join')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', 'abc')
      .expect(404, done);
  });

  it('GET /api/move should return 404', function(done){
    request(app)
      .get('/api/move')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', 'abc')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('GET /api/move/1,2,3 should return 404 before join the game', function(done){
    var aMove = [1,2,3];
    request(app)
      .get('/api/move/' + aMove.join(','))
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .expect(404, done);
  });

  it('GET /api/resign should return 404', function(done){
    request(app)
      .get('/api/resign')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', 'abc')
      .expect(404, done);
  });
});

describe('Game Logic', function(){
  it('join a board', function(done){
    request(app)
      .get('/api/join')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .expect(200, done);
  });

  it('join a board by another player', function(done){
    request(app)
      .get('/api/join')
      .set('x-lpb-player_id', 'PLAYER2_ID')
      .set('x-lpb-game_id', gameId)
      .expect(200, done);
  });

  it('get last move', function(done){
    request(app)
      .get('/api/move')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.body.should.be.instanceOf(Array);
        res.body.length.should.eql(0);
        done();
      });
  });

  it('take a step', function(done){
    var move = [1,2,3];
    request(app)
      .get('/api/move/' + move.join(','))
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .expect(200, done);
  });

  it('take a step by the same player should fail', function(done){
    var move = [1,2,3];
    request(app)
      .get('/api/move/' + move.join(','))
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .expect(406, done);
  });

  it('take a step by another player', function(done){
    var move = [1,2,3];
    request(app)
      .get('/api/move/' + move.join(','))
      .set('x-lpb-player_id', 'PLAYER2_ID')
      .set('x-lpb-game_id', gameId)
      .expect(200, done);
  });

  it('resign the board', function(done){
    request(app)
      .get('/api/resign')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .expect(200, done);
  });

  it('check the board status', function(done){
    request(app)
      .get('/api/show')
      .set('x-lpb-player_id', 'PLAYER1_ID')
      .set('x-lpb-game_id', gameId)
      .end(function(err, res) {
        var game = res.body;
        game.status.should.eql(2);
        game.steps.length.should.eql(3);
        done();
      });
  });

});
