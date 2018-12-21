// Wrapper for all UI activities and screen draws.
// This was required as we are invoking low of internal functions as part of minimax algo
// which in turn is impacting the results due to false positive screen rendering.
// Hence we will be calling this seperately to the functional logic.

const svg_x = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" ><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84); "></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84); "></path></svg>';
const svg_o = '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" ><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';
const svg_xo = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84);"></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84);"></path></svg>\
	<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

const svg_horizontal = '<svg class="crosses" aria-label="H" role="img" viewBox="0 0 128 128" ><path d="M0,64L128,64" style="stroke: rgb(84, 84, 84); stroke-width: 2.5px; "></path></svg>';
const svg_vertical = '<svg class="crosses" aria-label="V" role="img" viewBox="0 0 128 128" ><path d="M64,0L64,128" style="stroke: rgb(84, 84, 84); stroke-width: 2.5px; "></path></svg>';
const svg_diag = '<svg class="crosses" aria-label="D1" role="img" viewBox="0 0 128 128" ><path d="M16,16L128,128" style="stroke: rgb(84, 84, 84); stroke-width: 4px;"></path></svg>';

var UI = {};

UI.drawBoard = function() {
	logger.log("Entering into drawBoard");

	var gameboard_code = '\
			<div id="strike_row" class="container">' + svg_horizontal + '</div>\
			<div id="strike_col" class="container">' + svg_vertical + '</div>\
			<div id="strike_diag" class="container">' + svg_diag + '</div>\
			<div id="x-won" class="container">' + svg_x + '<span>WINNER</span></div>\
			<div id="o-won" class="container">' + svg_o + '<span>WINNER</span></div>\
			<div id="tie"   class="container">' + svg_xo + '<span>It\'s a TIE</span></div>\
			<table class="table text-center">\
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
	document.getElementById("messageboard").innerHTML = "<span><br>Hey there!! Pick a block.</span>";

	document.getElementById("score-x").innerHTML = "Human(X) - " + score_human;
	document.getElementById("score-o").innerHTML = "Robot(O) - " + score_robot;

}

UI.drawSVG = function(cell, parGameState) {
	logger.log("Entering into paintScreen");
	logger.log(cell, parGameState);
	
	if(parGameState.TURN === parGameState.SYMBOL.human) {
		document.getElementById(cell.id).innerHTML = svg_x;
	} else if(parGameState.TURN === parGameState.SYMBOL.robot) {
		document.getElementById(cell.id).innerHTML = svg_o;
	}
}

UI.animateGameOverCells = function(parGameState) {
	logger.log("Entering into animateGameOverCells");

	var pos = parGameState.WINNING_LINE;

	if( pos != undefined ) {
		if( (parGameState.SLASH_INFO).match(/strike_row/g) ) {
			setTimeout(function() {
				document.getElementById("strike_row").classList.add(parGameState.SLASH_INFO);
				var div = document.getElementById("strike_row");
				div.style.display = "block"; 
			}, 1000);
		}
		else if( (parGameState.SLASH_INFO).match(/strike_col/g) ) {
			setTimeout(function() {
				document.getElementById("strike_col").classList.add(parGameState.SLASH_INFO);
				var div = document.getElementById("strike_col");
				div.style.display = "block"; 
			}, 1000);
		}
		else if( (parGameState.SLASH_INFO).match(/strike_diag/g) ) {
			setTimeout(function() {
				document.getElementById("strike_diag").classList.add(parGameState.SLASH_INFO);
				var div = document.getElementById("strike_diag");
				div.style.display = "block"; 
			}, 1000);
		}
	}

	// this is too bad logic, n^3
	for (var row = 0; row < 3; row++) {
		logger.log("	row=" + row);
		for (var col = 0; col < 3; col++) {
			logger.log("		col=" + col);
			if( pos != undefined && ( 
				   ( row === pos[0][0] && col === pos[0][1] ) 
				|| ( row === pos[1][0] && col === pos[1][1] ) 
				|| ( row === pos[2][0] && col === pos[2][1] ) ) ) {
				logger.log("		pos=[" + row + "][" + col + "]");
				continue;
			}
			logger.log("		adding class for cell-"+(row+1)+(col+1));
			document.getElementById("cell-"+(row+1)+(col+1)).classList.add('lost-cells-gameover');
		}
	}
}

UI.displaySledging = function() {
	logger.log("Sledging Status :" +  alreadySledgedFlag.toString());
	logger.log("Sledging Value  :" +  winLoseStreak.toString());

	if( alreadySledgedFlag === 0 ) {
			logger.log("Sledging Status :" +  alreadySledgedFlag.toString());

		if(winLoseStreak.valueOf() === 2) {
			setTimeout(function() {
				$('#sledgingModal').modal('show');
			}, 5000);

			alreadySledgedFlag = 1;
		}

		if(winLoseStreak.valueOf() === -2) {
			setTimeout(function() {
				document.getElementById('sledgingModalId').innerHTML = "Too hard? You seem to be sweating heavily.<br> \
				Try changing difficulty level(s) and try again.";
				$('#sledgingModal').modal('show');
			}, 5000);

			alreadySledgedFlag = 1;
		}
	}
}

UI.updateScreen = function(parGameState) {
	logger.log("Entering into paintScreen");

	switch(parGameState.GAME_RESULT) {
		case parGameState.RESULTS.incomplete: {
			if(parGameState.TURN === parGameState.SYMBOL.robot){
				// When current marker is 'X', then the next step will be by 'O', hence the below logic
				document.getElementById("score-x").classList.remove('focus-score-x');
				document.getElementById("score-o").classList.add('focus-score-o');
				document.getElementById("messageboard").innerHTML = "<br>O's turn";
			} 
			else if(parGameState.TURN === parGameState.SYMBOL.human) {
				document.getElementById("score-o").classList.remove('focus-score-o');
				document.getElementById("score-x").classList.add('focus-score-x');
				document.getElementById("messageboard").innerHTML = "<br>X's turn";
			}
		}
		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.playerXWon: {
			document.getElementById("messageboard").innerHTML = "<br> Gameover";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');

			UI.animateGameOverCells(parGameState);

			document.getElementById("score-x").innerHTML = "Human(X) - " + score_human;
			document.getElementById("score-o").innerHTML = "Robot(O) - " + score_robot;

			setTimeout(function() {
				var div = document.getElementById("x-won");
				div.style.display = "block"; 
				document.getElementById("x-won").addEventListener("click", startGame, false);
			}, 4000);

			if(winLoseStreak >= 0) 
				winLoseStreak++;
			else
				winLoseStreak = 0;

			UI.displaySledging();
		}
		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.playerOWon: {
			document.getElementById("messageboard").innerHTML = "<br> Gameover";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');

			UI.animateGameOverCells(parGameState);

			document.getElementById("score-x").innerHTML = "Human(X) - " + score_human;
			document.getElementById("score-o").innerHTML = "Robot(O) - " + score_robot;
			
			setTimeout(function() {
				var div = document.getElementById("o-won");
				div.style.display = "block"; 
				document.getElementById("o-won").addEventListener("click", startGame, false);
			}, 4000);


			if(winLoseStreak <= 0) 
				winLoseStreak--;
			else
				winLoseStreak = 0;

			UI.displaySledging();
		}
		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.tie: {
			document.getElementById("messageboard").innerHTML = "<br> Gameover";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');

			UI.animateGameOverCells(parGameState);

			document.getElementById("score-x").innerHTML = "Human(X) - " + score_human;
			document.getElementById("score-o").innerHTML = "Robot(O) - " + score_robot;

			setTimeout(function() {
				var div = document.getElementById("tie");
				div.style.display = "block"; 
				document.getElementById("tie").addEventListener("click", startGame, false);
			}, 4000);


			winLoseStreak = 0; 
		}
		break;

		///////////////////////////////////////////////////////////
		default: {
			logger.log("What the hell happened?");
			document.getElementById("messageboard").innerHTML = "<br>what the hell just happened? huh?";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');
		}
	}
}