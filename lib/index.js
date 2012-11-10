var crypto = require('crypto')

var lpb = {}
  , gamesPlaying = {}
  , gamesPlayed = {}
  , gamesCreated = {};

function md5_hex(src) {
    var md5 = crypto.createHash('md5');
    md5.update(src, 'utf8');
    return md5.digest('hex');
}

function generateGameIdWithBoard(board) {
  return md5_hex(board);
}

lpb.createGame = function(board) {
  var gameId = generateGameIdWithBoard(board);
  gamesCreated[gameId] = {board:board};
  return board;
}

lpb.listGames = function() {
  var keys = [];
  for (var key in gamesCreated) {
    keys.push(key);
  }
  return keys;
}

lpb.joinGame = function(gameId, clientId) {
  return (gameId in gamesCreated);
}

module.exports = lpb;
