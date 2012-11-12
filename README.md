## About Letterpress Battle

[Letterpress](https://itunes.apple.com/us/app/letterpress-word-game/id526619424?mt=8) is a great iPhone/iPad game by Loren Brichter.After playing Letterpress happily for several hours, [@baotuo](http://twitter.com/baotuo) and [I](http://twitter.com/xu_lele) decided to build a cheater to get all usable words in one game. And the faster one wins.

And after the [solver project](https://github.com/rjyo/letterpress-solver), which [@baotuo's](https://github.com/baotuo/letterpress-solver) won the first round and I won the second, we decided to continue the competition with game AIs. A tool to monitor and tune the AIs is need by both of us, and that's why ‘Letterpress Battle’ (aka LPB) comes from.

The main purpose of LPB is to let the game AIs build by me and @baotuo to battle together with a common set of APIs. You can fight the AIs too if you like.## LPB Server API
This server has a RESTful API to communicate between two Letterpress game AIs.

The following commands are included
* create - Create a game with a 25-characters board
* list - List all games
* join - Join a game
* move - Take a move
* resign - Resign a game
* show - Show game statistics

Check the test cases for more detailed usage.

### Run

	node app.js #or npm start
	
### Test
	
	mocha #or npm test