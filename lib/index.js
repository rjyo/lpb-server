var crypto = require('crypto')

var lpb = {}
  , games = {};

function md5_hex(src) {
    var md5 = crypto.createHash('md5');
    md5.update(src, 'utf8');
    md5.update(new Date().getTime().toString(), 'utf8');
    return md5.digest('hex');
}

function generateGameIdWithBoard(board) {
  return md5_hex(board);
}

lpb.createGame = function(board) {
  var gameId = generateGameIdWithBoard(board);
  // status 0:created, 1: started, 2:ended
  games[gameId] = {
    board: board,
    status: 0,
    players: [],
    steps: []
  };
  return gameId;
}

lpb.listGames = function() {
  var keys = [];
  for (var key in games) {
    if (games[key].status == 0) keys.push(key);
  }
  return keys;
}

var Game = function(gameId, playerId) {
  this.gameId = gameId;
  this.playerId = playerId;
}

Game.prototype.game = function() {
  if (this.gameId in games) {
    return games[this.gameId];
  }
  return;
}

Game.prototype.join = function() {
  var found = false;
  if (this.gameId in games) {
    found = true;
    var game = games[this.gameId];
    // only join not yet started game
    if (game.status != 0) return false;

    if ('players' in game) {
      var players = game.players;
      if (players.indexOf(this.playerId) == -1) {
        players.push(this.playerId);
      }
      if (players.length == 2) {
        games[this.gameId].status = 1;
      }
    }
  }
  return found;
}

Game.prototype.lastMove = function() {
  var game = this.game();
  if (game) {
    var steps = game.steps;
    if (steps.length > 0) {
      return steps[steps.length - 1];
    }
  }
  return [];
}

Game.prototype.move = function(move) {
  var game = this.game();
  var lastMove = this.lastMove()

  if (lastMove.length == 0) {
    game.steps.push([this.playerId, move]);
    return true;
  } else if (lastMove.length > 0 && lastMove[0] != this.playerId) { // Can't move twice
    game.steps.push([this.playerId, move]);
    // console.log(game);
    return true;
  } else {
    return false;
  }
}

Game.prototype.resign = function() {
  var game = this.game();
  var lastMove = this.lastMove()

  // Can't resign a game you moved the last step
  if (lastMove.length > 0 && lastMove[0] != this.playerId) {
    game.steps.push([this.playerId, 'resign']);
    game.status = 2;
    return true;
  }
  return false;
}

lpb.Game = Game;

module.exports = lpb;
