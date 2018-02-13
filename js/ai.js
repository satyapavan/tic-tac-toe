// most of this code is straight out of https://github.com/Mostafa-Samir/Tic-Tac-Toe-AI/blob/master/scripts/ai.js
// he wrote the code so well that i ended up using the same names too

var AIAction = function(pos) {

    // public : the position on the board that the action would put the letter on
    this.movePosition = pos; // this is going to contain the awway as {row, col}

    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;
};

/*
 * public static function that defines a rule for sorting AIActions in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
    console.log("Entering into AIAction.ASCENDING");
    if(firstAction.minimaxVal < secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal > secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * public static function that defines a rule for sorting AIActions in descending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.DESCENDING = function(firstAction, secondAction) {
    console.log("Entering into AIAction.DESCENDING");
    if(firstAction.minimaxVal > secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal < secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a time
}


/*
 * Constructs an AI player with a specific level of intelligence
 * @param level [String]: the desired level of intelligence
 */
var AI = function() {

    var game; // this is the game state to handle, in other words this is the parGameState variable
    /*
     * private recursive function that computes the minimax value of a game state
     * @param state [State] : the state to calculate its minimax value
     * @returns [Number]: the minimax value of the state
     */
    function minimaxValue(parGameState, counter) {
        console.log("Entering into minimaxValue " + counter);

        if(parGameState.isGameOver()) {
            console.log(parGameState);
            //a terminal game state is the base case
            return parGameState.score();
        }
        else {
            var stateScore; // this stores the minimax value we'll compute

            if(parGameState.TURN === parGameState.SYMBOL.human)
            // X wants to maximize --> initialize to a value smaller than any possible score
                stateScore = -1000;
            else
            // O wants to minimize --> initialize to a value larger than any possible score
                stateScore = 1000;

            var available_cells = parGameState.emptyCells();

            //enumerate next available_cells states using the info form available_cells positions
            var available_NextStates = available_cells.map(function(pos) {

                var nextState = parGameState.clone();
                nextState.markCell(pos[0], pos[1]);
                nextState.transitionTurn();

                return nextState;
            });

            /* calculate the minimax value for all available_cells next states
             * and evaluate the current state's value */
            available_NextStates.forEach(function(nextState) {
                var nextScore = minimaxValue(nextState, counter++);
                if(parGameState.TURN === parGameState.SYMBOL.human) {
                    // X wants to maximize --> update stateScore iff nextScore is larger
                    if(nextScore > stateScore)
                        stateScore = nextScore;
                }
                else {
                    // O wants to minimize --> update stateScore iff nextScore is smaller
                    if(nextScore < stateScore)
                        stateScore = nextScore;
                }
            });

            return stateScore;
        }
    }

    /*
     * private function: make the ai player take a blind move
     * that is: choose the cell to place its symbol randomly
     * @param turn [String]: the player to play, either X or O
     */

    function takeAEasyMove() {
        console.log("Entering into takeAEasyMove");
        var available_cells = game.emptyCells();

        // it isn't called easy for a reason. its just random.
        // will it be better to atleast add a winning position and blocking position guess to it?
        // it should, as this is a easy move, not a dumb move
        var randomCell = available_cells[Math.floor(Math.random() * available_cells.length)];

        return randomCell;
    }


    /*
     * private function: make the ai player take a novice move,
     * that is: mix between choosing the optimal and suboptimal minimax decisions
     * @param turn [String]: the player to play, either X or O
     */
    function takeAMediumMove() {
        console.log("Entering into takeAMediumMove");
        var available_cells = game.emptyCells();

        //enumerate and calculate the score for each available_cells actions to the ai player
        var available_moves = available_cells.map(function(pos) {

            var action =  new AIAction(pos); //create the action object
            var new_state =  game.clone(); //clone the game state object for more permutations
            new_state.markCell(pos[0], pos[1]);
            new_state.transitionTurn();

            console.log("HELLLLLLO", new_state, game);
            action.minimaxVal = minimaxValue(new_state, 0); //calculate and set the action's minmax value

            return action;
        });

        console.log("available_moves.length = " + available_moves.length); 
        for(var itr = 0; itr < available_moves.length; itr++) {
            console.log("itr[" + itr + "] movePosition[" + available_moves[itr].movePosition 
                + "] minimaxVal[" + available_moves[itr].minimaxVal + "]");
        }

        //sort the enumerated actions list by score
        if(game.TURN === game.SYMBOL.human)
        //X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
            available_moves.sort(AIAction.DESCENDING);
        else
        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
            available_moves.sort(AIAction.ASCENDING);

        /*
         * take the optimal action 40% of the time, and take the 1st suboptimal action 60% of the time
         */
        var chosenMove;
        if(Math.random()*100 <= 60) {
            console.log("Playing a optimal solution as random <= 60");

            chosenMove = available_moves[0];
        }
        else {
            if(available_moves.length >= 2) {
                //if there is two or more available_cells actions, choose the 1st suboptimal
                chosenMove = available_moves[1];
            }
            else {
                //choose the only available_cells actions
                chosenMove = available_moves[0];
            }
        }

        return chosenMove;
    };

    /*
     * private function: make the ai player take a master move,
     * that is: choose the optimal minimax decision
     * @param turn [String]: the player to play, either X or O
     */
    function takeAHardMove() {
        console.log("Entering into takeAHardMove");

        var available_cells = game.emptyCells();

        //enumerate and calculate the score for each avaialable actions to the ai player
        var available_moves = available_cells.map(function(pos) {
            var action =  new AIAction(pos); //create the action object
            var new_state =  game.clone(); //clone the game state object for more permutations
            new_state.markCell(pos[0], pos[1]);
            new_state.transitionTurn();

            action.minimaxVal = minimaxValue(new_state, 0); //calculate and set the action's minmax value

            return action;
        });

        //sort the enumerated actions list by score
        if(game.TURN === game.SYMBOL.human)
        //X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
            available_moves.sort(AIAction.DESCENDING);
        else
        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
            available_moves.sort(AIAction.ASCENDING);

        //take the first action as it's the optimal
        return available_moves[0];
    }



    /*
     * public function: notify the ai player that it's its turn
     * @param turn [String]: the player to play, either X or O
     */
    this.getBestRobotMove = function(parGameState) {
        console.log("Entering into getBestRobotMove");

        game = parGameState.clone();
        var cell_to_play ; 

        switch(game.DIFFICULTY_LEVEL) {
            //invoke the desired behavior based on the level chosen
            case "Easy": 
                cell_to_play = takeAEasyMove(); 
                break;
            case "Medium": 
                cell_to_play = takeAMediumMove(); 
                break;
            case "Hard": 
                cell_to_play = takeAHardMove(); 
                break;
            default:
                console.log("Entered into default case, something is not right");
        }

        console.log("Choosen cell is [" + cell_to_play.movePosition + "] with a score of [" + cell_to_play.minimaxVal+"]");
        return cell_to_play.movePosition;
    }
};
