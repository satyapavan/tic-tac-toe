// This holds all the state variables of the current board game. an instance of this and you will get everything
var cGameState = function (level) {

	// Without the use of 'this', these will be not accessable from outside world.
	// adding 'this' makes them public variables, else they will be considered as private variables.

	this.SYMBOL = {
	  human:'X',
	  robot:'O'
	};

	this.RESULTS = {
	  incomplete: 0,
	  playerXWon: this.SYMBOL.human,
	  playerOWon: this.SYMBOL.robot,
	  tie: 3
	};

	this.BOARD = [
		["", "", ""],
		["", "", ""],
		["", "", ""]
	];

	this.TOTAL_MOVES = 0;
	this.O_MOVES_COUNT = 0; // Because this is used for scoring
	this.WINNING_LINE;
	this.DIFFICULTY_LEVEL = level;
	this.GAME_RESULT = this.RESULTS.incomplete;

	// Because 'X' always gets to start the game so initialize it with it.
	this.TURN = this.SYMBOL.human;
};