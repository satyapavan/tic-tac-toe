SYMBOLS = {
  player:'X',
  computer:'O'
};

var NO_OF_MOVES = 0;
var WINNING_LINE;

const RESULT = {
  incomplete: 0,
  playerXWon: SYMBOLS.player,
  playerOWon: SYMBOLS.computer,
  tie: 3
};

BOARD = [
	["", "", ""],
	["", "", ""],
	["", "", ""]
];

const svg_x = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" ><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84); stroke-dasharray: 135.764; stroke-dashoffset: 0;"></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84); stroke-dasharray: 135.764; stroke-dashoffset: 0;"></path></svg>';
const svg_o = '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" ><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

function drawGameOver() {
	console.log("Entered into drawGameOver");

}

function isGameOver(marker) {
	console.log("Entered into isGameOver");
	
	var game_status = false;

	var line;

	if(NO_OF_MOVES <= 5){
		console.log("Too few moves, game cannot be over yet");
		return false;
	}

	do {
		// check for row success
		for(var itr = 0; itr < 3; ++itr) {
			line = BOARD[itr].join('');

			if(line === marker.repeat(3)) {
				game_status = true;
				break;
			}
		}

		// check for col success
		for (var itr = 0; itr < 3; ++itr) {
			line = [BOARD[0][itr], BOARD[1][itr], BOARD[2][itr]];
			line = line.join('');

			if(line === marker.repeat(3)) {
				game_status = true;
				break;
			}	
		}

		// now check for diagonal success

		line = [BOARD[0][0], BOARD[1][1], BOARD[2][2]];
		line = line.join('');

		if(line === marker.repeat(3)) {
			game_status = true;
			break;
		}

		// now the other diagoal check

		line = [BOARD[0][2], BOARD[1][1], BOARD[2][0]];
		line = line.join('');

		if(line === marker.repeat(3)) {
			game_status = true;
			break;
		}

	} while(0);

	if(game_status) {
		console.log("WINNER OF THE GAME IS " + marker);
	}

	return game_status;
}

function computerMove() {
	isGameOver();
}

function playerMove() {
	console.log("Entering into playerMove");

	if( isCellMarked(this)) {
		console.log("As the cell is already marked, do not do anything");
		return true;
	}

	if( Math.round(Math.random()) == 0 ) {
		markCell(this, SYMBOLS.computer);
		isGameOver(SYMBOLS.computer);
	}
	else {
		markCell(this, SYMBOLS.player); 
		isGameOver(SYMBOLS.player);
	}

	// isGameOver(SYMBOLS.computer);
}

function isCellMarked(cell) {
	var status = BOARD[cell.getAttribute("data-row")][cell.getAttribute("data-col")] != "";
	console.log("isCellMarked[" + status + "]");
	return status;
}

function markCell(cell, marker) {
	if(isCellMarked(cell)) {
		console.log("Cell is already marked");
		return false;
	}

	BOARD[cell.getAttribute("data-row")][cell.getAttribute("data-col")] = marker;
	NO_OF_MOVES++;
	console.log(NO_OF_MOVES, BOARD);

	if(marker === "X") {
		document.getElementById(cell.id).innerHTML = svg_x;
		// When current marker is 'X', then the next step will be by 'O', hence the below logic
		document.getElementById("score-x").classList.remove('focus-score-x');
		document.getElementById("score-o").classList.add('focus-score-o');

	}
	else {
		document.getElementById(cell.id).innerHTML = svg_o;
		document.getElementById("score-o").classList.remove('focus-score-o');
		document.getElementById("score-x").classList.add('focus-score-x');
	}

	return true;
}

function initializeBoard() {
	console.log("Entered into initializeBoard");
}

function drawBoard() {
	console.log("Entered into drawBoard");
	var gameboard_code = '<table class="table text-center">\
				<tr class="c_row_1">\
					<td id="cell-11" class="c_col_1" role="button" tabindex="0" data-row="0" data-col="0"></td>\
					<td id="cell-12" class="c_col_2" role="button" tabindex="0" data-row="0" data-col="1"></td>\
					<td id="cell-13" class="c_col_3" role="button" tabindex="0" data-row="0" data-col="2"></td>\
				</tr>\
				<tr class="c_row_2">\
					<td id="cell-21" class="c_col_1" role="button" tabindex="0" data-row="1" data-col="0"></td>\
					<td id="cell-22" class="c_col_2" role="button" tabindex="0" data-row="1" data-col="1"></td>\
					<td id="cell-23" class="c_col_3" role="button" tabindex="0" data-row="1" data-col="2"></td>\
				</tr>\
				<tr class="c_row_3">\
					<td id="cell-31" class="c_col_1" role="button" tabindex="0" data-row="2" data-col="0"></td>\
					<td id="cell-32" class="c_col_2" role="button" tabindex="0" data-row="2" data-col="1"></td>\
					<td id="cell-33" class="c_col_3" role="button" tabindex="0" data-row="2" data-col="2"></td>\
				</tr>\
			</table>';

	document.getElementById("gameboard").innerHTML = gameboard_code ;
}

function activateBoard() {
	console.log("Entered into activateBoard");

	for (var row = 1; row <= 3; row++) {
		for (var col = 1; col <= 3; col++) {
			console.log("Adding listener for row[" + row + "] col[" + col + "]");	
			document.getElementById("cell-"+row+col).addEventListener("click", playerMove, false);
		}
	}
}

function startGame() {
	console.log("Entered into startGame");
	initializeBoard();
	drawBoard();
	activateBoard();
}

window.addEventListener("DOMContentLoaded", startGame, false);