var GAME_STATE;

var score_human = 0;
var score_robot = 0;

// This flag is to make sure we are only sledging once
var alreadySledgedFlag = 0;

// This is to note the winning/losing streak.
// Increment for a win and decrement for a lose and reset for a tie
var winLoseStreak = 0;

function computerMove() {
	logger.log("Entering into computerMove");
	makeEaseMove();
	isGameOver();
}

function robotMove() {
	logger.log("Entering into robotMove");

	logger.log(GAME_STATE.turn !== GAME_STATE.SYMBOL.robot);

	if( GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.robot) {
		logger.log("It seems the game is over, or its not your turn");
		return false;
	}

	var objAI = new AI();
	var cell_to_play = objAI.getBestRobotMove(GAME_STATE);

	if( GAME_STATE.isCellMarked(cell_to_play[0], cell_to_play[1])) {
		logger.log("As the cell is already marked, do not do anything");
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
	doPostTurnActivities();
	// when you feel eerything is over, then update the screen
	UI.updateScreen(GAME_STATE);

	// hello Mr. Player, its your move now! clock is ticking
}

function playerMove() {
	logger.log("Entering into playerMove");

	if( GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.human) {
		logger.log("It seems the game is over, or its not your turn");
		return false;
	}

	if( GAME_STATE.isCellMarked(this.getAttribute("data-row"), this.getAttribute("data-col"))) {
		logger.log("As the cell is already marked, do not do anything");
		return true;
	}

	GAME_STATE.markCell(this.getAttribute("data-row"), this.getAttribute("data-col")); 

	// first draw the X/O as per the turn
	UI.drawSVG(this, GAME_STATE);

	// then check if the game is over and if really is over, update scores or else change the player turn
	doPostTurnActivities();

	// when you feel eerything is over, then update the screen
	UI.updateScreen(GAME_STATE);

	// now, let me make my move. as this is a robot, we need to invoke it after human has played his move
	setTimeout(function() {
		robotMove();
	}, 1000);
}


function doPostTurnActivities() {
	logger.log("Entering into doPostTurnActivities");

	if (GAME_STATE.isGameOver()) {
		// yay!! game over, lets update the scores.
		updateScores();
	}
	else {
		// if not, then retransition to the next step/view
		GAME_STATE.transitionTurn();
	}
}

// every win fetches you 10 points and a tie gets 5 each.
// renamed the function name to reflect the new purpose of the function call.
function updateScores() {
	logger.log("Entering into updateScores");

	// not a fan of delimeters in 'case' statements, so leaving it simple
	switch (GAME_STATE.GAME_RESULT) {
		case GAME_STATE.RESULTS.playerXWon:
			score_human+=10;
			break;

		case GAME_STATE.RESULTS.playerOWon:
			score_robot+=10;
			break;

		case GAME_STATE.RESULTS.tie:
			score_robot+=5;
			score_human+=5;
			break;

		default:
			logger.log("Invalid Game result: " + GAME_STATE.GAME_RESULT);
	}

	logger.log("Human:" + score_human + "  -- Robot:" + score_robot);
}


function initializeBoard() {
	logger.log("Entered into initializeBoard");

	var level = $("#navbarSupportedContent").find(".active").children().text();

	GAME_STATE = new cGameState(level);

	logger.log(GAME_STATE);
}

function activateBoard() {
	logger.log("Entered into activateBoard");

	for (var row = 1; row <= 3; row++) {
		for (var col = 1; col <= 3; col++) {
			logger.log("Adding listener for row[" + row + "] col[" + col + "]");	
			document.getElementById("cell-" + row + col).addEventListener("click", playerMove, false);
		}
	}

	document.getElementById("restartgame").addEventListener("click", startGame, false);

	$("#navbarSupportedContent a").on("click", function() {
		logger.log("Entering to access the difficulty level");

		// make the current one not active
   		$("#navbarSupportedContent").find(".active").removeClass("active");

   		// make the pressed/new one as active
   		$(this).parent().addClass("active");

   		logger.log("level = " + $(this).text());

   		// you do not want to change level and still continue with current game, hence restart the game
   		startGame();
	});
}

function startGame() {
	logger.log("Entered into startGame");
	initializeBoard();
	UI.drawBoard();
	activateBoard();
}

window.addEventListener("DOMContentLoaded", startGame, false);