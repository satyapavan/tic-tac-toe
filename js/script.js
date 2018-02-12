var GAME_STATE;

var score_human = 0;
var score_robot = 0;

function computerMove() {
	console.log("Entering into computerMove");
	makeEaseMove();
	isGameOver();
}

function robotMove() {
	console.log("Entering into robotMove", GAME_STATE);

	console.log(GAME_STATE.isGameOver());
	console.log(GAME_STATE.turn !== GAME_STATE.SYMBOL.robot);

	if( GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.robot) {
		console.log("It seems the game is over, or its not your turn");
		return false;
	}

	var objAI = new AI();
	console.log(objAI);
	var cell_to_play = objAI.getBestRobotMove(GAME_STATE);

	if( GAME_STATE.isCellMarked(cell_to_play[0], cell_to_play[1])) {
		console.log("As the cell is already marked, do not do anything");
		return true;
	}

	GAME_STATE.markCell(cell_to_play[0], cell_to_play[1]); 

	var cell = {};
	// because cell_to_play contains array values of 0...to length-1 and 
	// for cell-id we have the values from 1 to length
	cell.id = "cell-" + (cell_to_play[0]+1) + (cell_to_play[1]+1);
	// first draw the X/O as per the turn
	UI.drawSVG(cell, GAME_STATE);
	// then check if the game is over
	if(!GAME_STATE.isGameOver()) {
		// if not, then retransition to the next step/view
		GAME_STATE.transitionTurn();
	}
	else {
		if(GAME_STATE.GAME_RESULT === GAME_STATE.RESULTS.playerXWon) {
			score_human++;
		} else if(GAME_STATE.GAME_RESULT === GAME_STATE.RESULTS.playerOWon) {
			score_robot++;
		}
	}
	// when you feel eerything is over, then update the screen
	UI.updateScreen(GAME_STATE);

	//hello Mr. Player, its your move now! clock is ticking
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
	else {
		if(GAME_STATE.GAME_RESULT === GAME_STATE.RESULTS.playerXWon) {
			score_human++;
		} else if(GAME_STATE.GAME_RESULT === GAME_STATE.RESULTS.playerOWon) {
			score_robot++;
		}
	}
	
	// when you feel eerything is over, then update the screen
	UI.updateScreen(GAME_STATE);

	// now, let me make my move. as this is a robot, we need to invoke it after human has played his move
	setTimeout(function() {
		robotMove();
	}, 1000);
}



function initializeBoard() {
	console.log("Entered into initializeBoard");

	var level = $("#navbarSupportedContent").find(".active").children().text();

	GAME_STATE = new cGameState(level);

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

	$("#navbarSupportedContent a").on("click", function(){
		console.log("Entering to access the difficulty level");

		// make the current one not active
   		$("#navbarSupportedContent").find(".active").removeClass("active");

   		// make the pressed/new one as active
   		$(this).parent().addClass("active");

   		console.log("level = " + $(this).text());

   		// you do not want to change level and still continue with current game, hence restart the game
   		startGame();
	});
}

function startGame() {
	console.log("Entered into startGame");
	initializeBoard();
	UI.drawBoard();
	activateBoard();
}

window.addEventListener("DOMContentLoaded", startGame, false);