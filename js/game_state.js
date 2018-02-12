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

	this.clone = function() {
		console.log("Entering into clone", this);
		var cloneGameState = new cGameState();

		cloneGameState.TOTAL_MOVES = this.TOTAL_MOVES;
		cloneGameState.O_MOVES_COUNT = this.O_MOVES_COUNT;
		cloneGameState.WINNING_LINE = this.WINNING_LINE;  // this is an array too, so will it be a problem?
		cloneGameState.DIFFICULTY_LEVEL = this.DIFFICULTY_LEVEL;
		cloneGameState.GAME_RESULT = this.GAME_RESULT;
		cloneGameState.TURN = this.TURN;

		for (var row = 0; row < 3; row++) {
			for (var col = 0; col < 3; col++) {
				cloneGameState.BOARD[row][col] = this.BOARD[row][col];
			}
		}

		console.log("Original object ", this);
		console.log("Clone    object ", cloneGameState);

		return cloneGameState;
	}

	this.emptyCells = function() {
		console.log("Entering into emptyCells");
		var available_list = [];
		console.log(available_list);
		for (var row = 0; row < 3; row++) {
			for (var col = 0; col < 3; col++) {
				if( this.BOARD[row][col] === "" ) {
					available_list.push([row, col]);
				}
			}
		}
		console.log(available_list);
		return available_list;
	};


	this.isCellMarked = function(row, col) {
		var status = this.BOARD[row][col] !== "";
		console.log("isCellMarked[" + status + "]");
		return status;
	}

	this.markCell = function(row, col) {
		if(this.isCellMarked(row, col)) {
			console.log("Cell is already marked");
			return false;
		}

		this.BOARD[row][col] = this.TURN ;

		// BOARD[cell.getAttribute("data-row")][cell.getAttribute("data-col")] = marker;
		this.TOTAL_MOVES++;

		if(this.TURN === this.SYMBOL.robot)
			this.O_MOVES_COUNT++ ;  // This is used for score calculation

		console.log(this);

		return true;
	}

	this.transitionTurn = function() {
		console.log("Entering into transitionTurn");
		console.log(this);
		this.emptyCells();
		this.TURN = this.TURN === this.SYMBOL.human ? this.SYMBOL.robot : this.SYMBOL.human;

		console.log(this);
	}

	this.score = function() {
		console.log("Entering into score");
		var score = 0;

	    if(this.GAME_RESULT === this.RESULTS.playerXWon){
	        // the x player won
	        score = 10 - this.O_MOVES_COUNT;
	    }
	    else if(this.GAME_RESULT === this.RESULTS.playerOWon) {
	        //the x player lost
	        score = -10 + this.O_MOVES_COUNT;
	    }
	    else {
	        //it's a draw
	        score = 0;
	    }

	    console.log("Score = [" + score + "]");
	    return score;
	}

	this.isGameOver = function() {
		console.log("Entered into isGameOver");
		
		var line;
		var pos;
		var game_status = false;

		// make sure there is no <= there, elese the gameover is not coming after 5 moves. yuck!
		if(this.TOTAL_MOVES < 5){
			console.log("Too few moves, game cannot be over yet");
			this.GAME_STATUS = this.RESULTS.incomplete ; 
			return false;
		}

		do {
			// check for row success
			for(var itr = 0; itr < 3; ++itr) {
				line = this.BOARD[itr].join('');

				if(line === this.TURN.repeat(3)) {
					pos = [ [itr, 0], [itr, 1], [itr, 2] ];
					game_status = true;
					break;
				}
			}

			// check for col success
			for (var itr = 0; itr < 3; ++itr) {
				line = [this.BOARD[0][itr], this.BOARD[1][itr], this.BOARD[2][itr]];
				line = line.join('');

				if(line === this.TURN.repeat(3)) {
					pos = [ [0, itr], [1, itr], [2, itr] ];
					game_status = true;
					break;
				}	
			}

			// now check for diagonal success

			line = [this.BOARD[0][0], this.BOARD[1][1], this.BOARD[2][2]];
			line = line.join('');

			if(line === this.TURN.repeat(3)) {
				pos = [ [0, 0], [1, 1], [2, 2] ];
				game_status = true;
				break;
			}

			// now the other diagoal check

			line = [this.BOARD[0][2], this.BOARD[1][1], this.BOARD[2][0]];
			line = line.join('');

			if(line === this.TURN.repeat(3)) {
				pos = [ [0, 2], [1, 1], [2, 0] ];
				game_status = true;
				break;
			}

		} while(0);

		if(game_status) {
			console.log("WINNER OF THE GAME IS " + this.TURN);

			this.WINNING_LINE = pos;

			if(this.TURN === this.SYMBOL.human ) {
				this.GAME_RESULT = this.RESULTS.playerXWon ;
			} else {
				this.GAME_RESULT = this.RESULTS.playerOWon ;
			}

		} else if(this.TOTAL_MOVES == 9) {
			console.log("All the steps are exhausted, its a TIE");
			this.GAME_RESULT = this.RESULTS.tie;
			game_status = true;
		}

		return game_status;
	}
};

