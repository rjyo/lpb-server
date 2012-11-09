var express = require('express')
  , l = require('./lib');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Start a game with specified board, the game_id will be retuned
app.get('/api/create/:board', function(req, res) {
  var gameId = l.createGame(req.params.board);
  res.json({game_id: gameId});
});

// list all games that are available to join
app.get('/api/list', function(req, res) {
  console.log(req.route);
  res.json(content);
});

// To call the following APIs, game_id and client_id should be put in the header
// x-header-lpb-game_id:game_id_hash
// x-header-lpb-client_id:client_id_hash

// Join a game
app.get('/api/join/:game_id', function(req, res) {
  console.log(req.route);
  res.json(content);
});

// Input a move
app.get('/api/move/:move', function(req, res) {
  console.log(req.route);
  res.json(content);
});

// Resign a game
app.get('/api/resign', function(req, res) {
  console.log(req.route);
  res.json(content);
});

module.exports = app;
// app.listen(3000);
// console.log('Letterpress Battle Server Started.')
