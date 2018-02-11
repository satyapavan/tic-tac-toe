var GAME_STATE;

function computerMove() {
	console.log("Entering into computerMove");
	makeEaseMove();
	isGameOver();
}

function robotMove() {
	console.log("Entering into robotMove");

}

function playerMove() {
	console.log("Entering into playerMove");

	if( GAME_STATE.isCellMarked(this.getAttribute("data-row"), this.getAttribute("data-col"))) {
		console.log("As the cell is already marked, do not do anything");
		return true;
	}

	GAME_STATE.markCell(this.getAttribute("data-row"), this.getAttribute("data-col")); 

	// first draw the X/O as per the turn
	UI.drawSVG(this, GAME_STATE);
	// then check if the game is over
	if(!GAME_STATE.isGameOver()) {
		// if not, then retransition to the next step/view
		GAME_STATE.transitionTurn();
	}
	// when you feel eerything is over, then update the screen
	UI.updateScreen(GAME_STATE);

	// now, let me make my move. as this is a robot, we need to invoke it after human has played his move
	robotMove();
}



function initializeBoard() {
	console.log("Entered into initializeBoard");
	var level;
	 GAME_STATE = new cGameState(level);

	$("#navbarSupportedContent a").on("click", function(){
		console.log("Entering to access the difficulty level");

   		$("#navbarSupportedContent").find(".active").removeClass("active");
   		$(this).parent().addClass("active");
   		level = $(this).text();

   		console.log(this);
   		console.log("level = " + level);
	});

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