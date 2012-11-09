var should = require('should')
  , request = require('supertest')
  , app = require('../app');

// Infomation
// http://stackoverflow.com/questions/11927196/supertest-custom-express-server-in-node
// https://github.com/visionmedia/supertest

describe('User API',function(){

  it('GET /api/create should return 200',function(done){
    request(app)
      .get('/api/create/testboard')
      .expect(200, done);
  });

});
