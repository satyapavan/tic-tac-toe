// Wrapper for all UI activities and screen draws.
// This was required as we are invoking low of internal functions as part of minimax algo
// which in turn is impacting the results due to false positive screen rendering.
// Hence we will be calling this seperately to the functional logic.

const svg_x = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" ><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84); "></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84); "></path></svg>';
const svg_o = '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" ><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

const svg_xo = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84);"></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84);"></path></svg>\
	<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

var UI = {};

UI.drawBoard = function() {
	console.log("Entering into drawBoard");

	var gameboard_code = '\
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
	console.log("Entering into paintScreen");
	console.log(cell, parGameState);
	
	if(parGameState.TURN === parGameState.SYMBOL.human){
		document.getElementById(cell.id).innerHTML = svg_x;
	} else if(parGameState.TURN === parGameState.SYMBOL.robot){
		document.getElementById(cell.id).innerHTML = svg_o;
	}
}

UI.animateGameOverCells = function(parGameState) {
	console.log("Entering into animateGameOverCells");

	var pos = parGameState.WINNING_LINE;

	// this is too bad logic, n^3
	for (var row = 0; row < 3; row++) {
		console.log("	row=" + row);
		for (var col = 0; col < 3; col++) {
			console.log("		col=" + col);
			if( ( row === pos[0][0] && col === pos[0][1] ) 
				|| ( row === pos[1][0] && col === pos[1][1] ) 
				|| ( row === pos[2][0] && col === pos[2][1] ) ) {
				console.log("		pos=[" + row + "][" + col + "]");
				continue;
			}
			console.log("		adding class for cell-"+(row+1)+(col+1));
			document.getElementById("cell-"+(row+1)+(col+1)).classList.add('lost-cells-gameover');
		}
	}
}

UI.updateScreen = function(parGameState) {
	console.log("Entering into paintScreen");

	switch(parGameState.GAME_RESULT) {
		case parGameState.RESULTS.incomplete :

		if(parGameState.TURN === parGameState.SYMBOL.robot){
			// When current marker is 'X', then the next step will be by 'O', hence the below logic
			document.getElementById("score-x").classList.remove('focus-score-x');
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("messageboard").innerHTML = "<br>O's turn";
		} 
		else if(parGameState.TURN === parGameState.SYMBOL.human){
			document.getElementById("score-o").classList.remove('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');
			document.getElementById("messageboard").innerHTML = "<br>X's turn";
		}

		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.playerXWon :
			document.getElementById("messageboard").innerHTML = "<br> Gameover";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');

			UI.animateGameOverCells(parGameState);

			document.getElementById("score-x").innerHTML = "Human(X) - " + score_human;
			document.getElementById("score-o").innerHTML = "Robot(O) - " + score_robot;

			setTimeout(function(){
				var div = document.getElementById("x-won");
				div.style.display = "block"; 
				document.getElementById("x-won").addEventListener("click", startGame, false);
			}, 4000);

		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.playerOWon :
			document.getElementById("messageboard").innerHTML = "<br> Gameover";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');

			UI.animateGameOverCells(parGameState);

			document.getElementById("score-x").innerHTML = "Human(X) - " + score_human;
			document.getElementById("score-o").innerHTML = "Robot(O) - " + score_robot;
			
			setTimeout(function(){
				var div = document.getElementById("o-won");
				div.style.display = "block"; 
				document.getElementById("o-won").addEventListener("click", startGame, false);
			}, 4000);

		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.tie :
			document.getElementById("messageboard").innerHTML = "<br> Gameover";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');

			UI.animateGameOverCells(parGameState);

			setTimeout(function(){
				var div = document.getElementById("tie");
				div.style.display = "block"; 
				document.getElementById("tie").addEventListener("click", startGame, false);
			}, 4000);

		break;

		///////////////////////////////////////////////////////////
		default:
			console.log("What the hell happened?");
			document.getElementById("messageboard").innerHTML = "<br>what the hell just happened? huh?";
			document.getElementById("score-o").classList.add('focus-score-o');
			document.getElementById("score-x").classList.add('focus-score-x');
	}
}