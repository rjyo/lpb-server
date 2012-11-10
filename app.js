var express = require('express')
  , l = require('./lib');

var app = express();

app.use(express.static(__dirname + '/public'));
// app.use(express.logger());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());

// Start a game with specified board, the game_id will be retuned
app.get('/api/create/:board', function(req, res) {
  var gameId = l.createGame(req.params.board);
  res.json({game_id: gameId});
});

// list all games that are available to join
app.get('/api/list', function(req, res) {
  res.json(l.listGames());
});

// To call the following APIs, game_id and player_id should be put in the header
// x-header-lpb-game_id:game_id_hash
// x-header-lpb-player_id:player_id_hash
function checkAuth(req, res, next) {
  var gameId = req.headers['x-lpb-game_id'];
  var playerId = req.headers['x-lpb-player_id'];

  if (!gameId || !playerId) {
    res.send(406, {error: 'Game ID and Client ID should be specified in the request header'});
  } else {
    req.game = new l.Game(gameId, playerId)
    next();
  }
}

function checkJoined(req, res, next) {
  var currentGame = req.game.game();
  if (!currentGame) {
    return res.send(404, {error: 'Game ID not available' });
  } else if (currentGame.players.indexOf(req.game.playerId) == -1) {
    return res.send(404, {error: 'You haven\'t joined this game.' });
  } else if (currentGame.status == 0) {
    return res.send(406, {error: 'Game not have enough players to start' });
  }
  next();
}

// Join a game
app.get('/api/join', checkAuth, function(req, res) {
  if (req.game.join()) {
    res.send(200);
  } else {
    res.send(404);
  }
});

// Input a move
app.get('/api/move/:move?', checkAuth, checkJoined, function(req, res) {
  if (!req.params.move) {
    res.json(req.game.lastMove());
  } else {
    var move = req.params.move.split(',');
    if (move.length > 0) {
      if (req.game.move(move)) {
        return res.send(200);
      }
    }

    res.send(406, {error: 'Invalid move [' + move + ']'});
  }
});

// Resign a game
app.get('/api/resign', checkAuth, checkJoined, function(req, res) {
  if (req.game.resign()) {
    res.send(200);
  } else {
    res.send(406, {error: 'Unable to resign game. It\'s not your turn or you are not one of the players.'});
  }
});

// Fetch a game
app.get('/api/show', checkAuth, checkJoined, function(req, res) {
  res.send(req.game.game())
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.send(404);
});

app.listen(3000);

module.exports = app;
