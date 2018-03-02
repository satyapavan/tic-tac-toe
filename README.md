### About
Javascript implementation of tic tac toe game with varying levels of difficulties and artificial intellegence.
This is my first hands-on with javascript, so you may find many instances which could be handled better. If you see any such parts, feel free to let me know. I will be happy to learn.

### Difficulty levels
This game is having 3 levels of intelligence. They are listed as below,

|               | Easy        | Medium | Hard |
| ------------- |:-------------:|:--------:|:------:|
| Play a WINning move | Always| Always | Always |
| Play a BLOCKing move| Random play  |   50% of times | Always |
| Other's | Random play | Best possible move 50% of times | Best possible move |

### Scoring
- Wining player fetches **10 points**
- Losing player fetches **0 points** (no negative scoring either)
- A TIE fetches each player **5 points** each

### Live demo
https://satyapavan.github.io/tic-tac-toe-js/

### Screenshots 
<div>
  <img src="images/X-wins.gif" alt="X winning" width=270>
  <img src="images/O-wins.gif" alt="O Winning" width=270>
  <img src="images/XO-tie.gif" alt="Tied game" width=270>
</div>

**Good References**
- https://github.com/carpben/TicTacToe (The one that wrote an article about the best position and no loss algo)
- https://github.com/ttsu/tictactoe-java (Java implementation with AI)
- https://github.com/Mostafa-Samir/Tic-Tac-Toe-AI (JS implementation with multiple level's of AI)
- https://github.com/amitness/Tic-Tac-Toe (Udacity project, i think its a player vs. player)
- https://github.com/LazoCoder/Tic-Tac-Toe (Good One)
