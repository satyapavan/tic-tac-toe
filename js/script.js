var GAME_STATE;

function drawGameOver() {
	console.log("Entered into drawGameOver");

}

function isGameOver(parGameState) {
	console.log("Entered into isGameOver");
	
	var line;
	var game_status = false;

	if(parGameState.TOTAL_MOVES <= 5){
		console.log("Too few moves, game cannot be over yet");
		parGameState.GAME_STATUS = parGameState.RESULTS.incomplete ; 
		return false;
	}

	do {
		// check for row success
		for(var itr = 0; itr < 3; ++itr) {
			line = parGameState.BOARD[itr].join('');

			if(line === parGameState.TURN.repeat(3)) {
				game_status = true;
				break;
			}
		}

		// check for col success
		for (var itr = 0; itr < 3; ++itr) {
			line = [parGameState.BOARD[0][itr], parGameState.BOARD[1][itr], parGameState.BOARD[2][itr]];
			line = line.join('');

			if(line === parGameState.TURN.repeat(3)) {
				game_status = true;
				break;
			}	
		}

		// now check for diagonal success

		line = [parGameState.BOARD[0][0], parGameState.BOARD[1][1], parGameState.BOARD[2][2]];
		line = line.join('');

		if(line === parGameState.TURN.repeat(3)) {
			game_status = true;
			break;
		}

		// now the other diagoal check

		line = [parGameState.BOARD[0][2], parGameState.BOARD[1][1], parGameState.BOARD[2][0]];
		line = line.join('');

		if(line === parGameState.TURN.repeat(3)) {
			game_status = true;
			break;
		}

	} while(0);

	if(game_status) {
		console.log("WINNER OF THE GAME IS " + parGameState.TURN);

		parGameState.WINNING_LINE = line;

		if(parGameState.TURN === parGameState.SYMBOL.human ) {
			parGameState.GAME_RESULT = parGameState.RESULTS.playerXWon ;
		} else {
			parGameState.GAME_RESULT = parGameState.RESULTS.playerOWon ;
		}

	} else if(parGameState.TOTAL_MOVES == 9) {
		console.log("All the steps are exhausted, its a TIE");
		parGameState.GAME_RESULT = parGameState.RESULTS.tie;
		game_status = true;
	}

	return game_status;
}

function transitionTurn(parGameState) {
	console.log("Entering into transitionTurn");
	console.log(parGameState);
	parGameState.TURN = parGameState.TURN === parGameState.SYMBOL.human ? parGameState.SYMBOL.robot : parGameState.SYMBOL.human;

	console.log(parGameState);
}

function computerMove() {
	console.log("Entering into computerMove");
	makeEaseMove();
	isGameOver();
}

function playerMove() {
	console.log("Entering into playerMove");

	if( isCellMarked(this.getAttribute("data-row"), this.getAttribute("data-col"), GAME_STATE)) {
		console.log("As the cell is already marked, do not do anything");
		return true;
	}

	markCell(this.getAttribute("data-row"), this.getAttribute("data-col"), GAME_STATE); 

	// first draw the X/O as per the turn
	UI.drawSVG(this, GAME_STATE);
	// then check if the game is over
	if(!isGameOver(GAME_STATE)) {
		// if not, then retransition to the next step/view
		transitionTurn(GAME_STATE);
	}
	// when you feel eerything is over, then update the screen
	UI.updateScreen(GAME_STATE);
}

function isCellMarked(row, col, parGameState) {
	var status = parGameState.BOARD[row][col] !== "";
	console.log("isCellMarked[" + status + "]");
	return status;
}

function markCell(row, col, parGameState) {
	if(isCellMarked(row, col, parGameState)) {
		console.log("Cell is already marked");
		return false;
	}

	parGameState.BOARD[row][col] = parGameState.TURN ;

	// BOARD[cell.getAttribute("data-row")][cell.getAttribute("data-col")] = marker;
	parGameState.TOTAL_MOVES++;

	if(parGameState.TURN === parGameState.SYMBOL.robot)
		parGameState.O_MOVES_COUNT++ ;  // This is used for score calculation

	console.log(parGameState);

	return true;
}

function initializeBoard() {
	console.log("Entered into initializeBoard");
	 GAME_STATE = new cGameState("pass_the_level_later");
	 console.log(GAME_STATE);
}

function activateBoard() {
	console.log("Entered into activateBoard");

	for (var row = 1; row <= 3; row++) {
		for (var col = 1; col <= 3; col++) {
			console.log("Adding listener for row[" + row + "] col[" + col + "]");	
			document.getElementById("cell-"+row+col).addEventListener("click", playerMove, false);
		}
	}

	document.getElementById("restartgame").addEventListener("click", startGame, false);
}

function startGame() {
	console.log("Entered into startGame");
	initializeBoard();
	UI.drawBoard();
	activateBoard();
}

window.addEventListener("DOMContentLoaded", startGame, false);
