// Wrapper for all UI activities and screen draws.
// This was required as we are invoking low of internal functions as part of minimax algo
// which in turn is impacting the results due to false positive screen rendering.
// Hence we will be calling this seperately to the functional logic.

const svg_x = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" ><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84); stroke-dasharray: 135.764; stroke-dashoffset: 0;"></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84); stroke-dasharray: 135.764; stroke-dashoffset: 0;"></path></svg>';
const svg_o = '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" ><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

const svg_o_won = '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" style="width: 128px; height: 128px;"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

const svg_x_won = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" style="width: 128px; height: 128px;"><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84);"></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84);"></path></svg>';

const svg_tie = '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M16,16L112,112" style="stroke: rgb(84, 84, 84);"></path><path d="M112,16L16,112" style="stroke: rgb(84, 84, 84);"></path></svg>\
	<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path></svg>';

var UI = {};

UI.drawBoard = function() {
	console.log("Entering into drawBoard");
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
	document.getElementById("messageboard").innerHTML = "<span><br>Hey there!! Pick a block.</span>";
}

UI.drawSVG = function(cell, parGameState) {
	console.log("Entering into paintScreen");
	if(parGameState.TURN === parGameState.SYMBOL.human){
		document.getElementById(cell.id).innerHTML = svg_x;
	} else if(parGameState.TURN === parGameState.SYMBOL.robot){
		document.getElementById(cell.id).innerHTML = svg_o;
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
			document.getElementById("messageboard").innerHTML = "<br> '" + parGameState.SYMBOL.human + "' WON!";
			// document.getElementById("game_table").innerHTML = svg_x_won;

		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.playerOWon :
			document.getElementById("messageboard").innerHTML = "<br> '" + parGameState.SYMBOL.robot + "' WON!";
			// document.getElementById("game_table").innerHTML = svg_o_won;
		break;

		///////////////////////////////////////////////////////////
		case parGameState.RESULTS.tie :
			document.getElementById("messageboard").innerHTML = "<br>It's a TIE!!";
			// document.getElementById("game_table").innerHTML = svg_tie;
		break;

		///////////////////////////////////////////////////////////
		default:
			console.log("What the hell happened?");
			document.getElementById("messageboard").innerHTML = "<br>what the hell just happened? huh?";
	}
}