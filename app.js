var express = require('express')
  , l = require('./lib');

var app = express();

app.use(express.static(__dirname + '/public'));
// app.use(express.logger());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Start a game with specified board, the game_id will be retuned
app.get('/api/create/:board', function(req, res) {
  var gameId = l.createGame(req.params.board);
  res.json({game_id: gameId});
});

// list all games that are available to join
app.get('/api/list', function(req, res) {
  res.json(l.listGames());
});

// To call the following APIs, game_id and client_id should be put in the header
// x-header-lpb-game_id:game_id_hash
// x-header-lpb-client_id:client_id_hash
function checkAuth(req, res, next) {
  var gameId = req.headers['x-lpb-game_id'];
  var clientId = req.headers['x-lpb-client_id'];
  if (!gameId || !clientId) {
    res.send(401);
  } else {
    next();
  }
}

// Join a game
app.get('/api/join', checkAuth, function(req, res) {
  var gameId = req.headers['x-lpb-game_id'];
  var clientId = req.headers['x-lpb-client_id'];

  if (l.joinGame(gameId, clientId)) {
    res.send(200);
  } else {
    res.send(404);
  }
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
