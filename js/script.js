SYMBOLS = {
  player:'X',
  computer:'O'
};

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

function playerMove() {
	console.log("Entering into playerMove");

	if( isCellMarked(this)) {
		console.log("As the cell is already marked, do not do anything");
		return true;
	}

	if( Math.round(Math.random()) == 0 ) 
		markCell(this, SYMBOLS.computer);
	else
		markCell(this, SYMBOLS.player);
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
	console.log(BOARD);

	if(marker === "X")
		document.getElementById(cell.id).innerHTML = svg_x;
	else
		document.getElementById(cell.id).innerHTML = svg_o;

	return true;
}

function activateBoard() {
	console.log("Entered into activateBoard");
	// TODO - this is a place holder for creating the table/game board on the fly at a later point of time.

	for (var row = 1; row <= 3; row++) {
		for (var col = 1; col <= 3; col++) {
			console.log("Adding listener for row[" + row + "] col[" + col + "]");	
			document.getElementById("cell-"+row+col).addEventListener("click", playerMove, false);
		}
	}
}

window.addEventListener("DOMContentLoaded", activateBoard, false);