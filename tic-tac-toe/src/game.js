// game.js
const TTT_MODULE = require('./tic-tac-toe.js');
const READLINE_SYNC = require('readline-sync');
let computerMoves, playerMoves;

function getUserPrefs() {
    console.log("Shall we play a game of TIC TAC TOE?");

    const gameBoardWidth = READLINE_SYNC.question("What is the width of the board you want to play on? (1 - 26)\n> ", {
        limit: (input) => { if (input > 1 && input <= 26) return true; return false; },
        limitMessage: "Must be between 1 and 26!"
      });

    const userLetter = READLINE_SYNC.question("Pick your letter: X or O\n> ", {
        limit: (input) => { if (input === 'X' || input === 'O') return true; return false },
        limitMessage: "Must be either X or O!"
      });

    console.log("Player is: " + userLetter);

    return {boardWidth: gameBoardWidth, userLetter: userLetter}
}

function compMove(gameBoard, letter) {
    let currCompMove = TTT_MODULE.getRandomEmptyCellIndex(gameBoard);
    let move;

    if (computerMoves && computerMoves.length > 0) {
        do {
            move = computerMoves.shift();
        } while (!(TTT_MODULE.isValidMove(gameBoard, move[0], move[1])));

        if (TTT_MODULE.isValidMove(gameBoard, move[0], move[1])) {
            gameBoard = TTT_MODULE.setBoardCell(gameBoard, letter, move[0], move[1]);
        }
        else {
            move = TTT_MODULE.toRowCol(gameBoard, currCompMove);
            gameBoard = TTT_MODULE.setBoardCell(gameBoard, letter, move.row, move.col);
        }
    }
    else {
        move = TTT_MODULE.toRowCol(gameBoard, currCompMove);
        gameBoard = TTT_MODULE.setBoardCell(gameBoard, letter, move.row, move.col);
    }

    // console.log(`move is to index ${currCompMove}`);
    console.log(`comp move ${JSON.stringify(move)}`);
        
    READLINE_SYNC.question("Press <ENTER> to show computer's move...");

    console.log(TTT_MODULE.boardToString(gameBoard));

    return gameBoard;
}

function userMove(gameBoard, letter) {

    // scripted moves implementation
    let move;

    if (playerMoves && playerMoves.length > 0) {
        do {
            move = playerMoves.shift();
        } while (!(TTT_MODULE.isValidMove(gameBoard, move[0], move[1])));

        if (TTT_MODULE.isValidMove(gameBoard, move[0], move[1])) {
            gameBoard = TTT_MODULE.setBoardCell(gameBoard, letter, move[0], move[1]);

            READLINE_SYNC.question('Press <ENTER> to confirm player\'s scripted move...');
            console.log(TTT_MODULE.boardToString(gameBoard));

            return gameBoard;
        }
    }

    // regular gameplay
    let currUserMove = READLINE_SYNC.question("What's your move?\n> ", {
        limit: (input) => {
            if (TTT_MODULE.algebraicToRowCol(input) && TTT_MODULE.isValidMove(gameBoard, TTT_MODULE.algebraicToRowCol(input).row, TTT_MODULE.algebraicToRowCol(input).col)) {
                return true
            }
            else { return false }
        },
        limitMessage: "Your move must be in a LetterNumber format, and it must specify an existing empty cell!"
      });

    gameBoard = TTT_MODULE.setBoardCell(gameBoard, letter, TTT_MODULE.algebraicToRowCol(currUserMove).row, TTT_MODULE.algebraicToRowCol(currUserMove).col);
    
    console.log(TTT_MODULE.boardToString(gameBoard));

    return gameBoard;
}

function printWinnerDraw(gameBoard, winnerLetter, compLetter, userLetter) {
    if (winnerLetter === compLetter) console.log("Computer won!");
    if (winnerLetter === userLetter) console.log("Player won!");
    if (TTT_MODULE.isBoardFull(gameBoard)) console.log("It's a draw!");
}

function mainGame() {

    const script = process.argv[2] ? JSON.parse(process.argv[2]) : undefined;

    if (script) {
        computerMoves = script[0];
        playerMoves = script[1];
    }

    console.log(`Computer will make the following moves: ${JSON.stringify(computerMoves)}\nPlayer will make the following moves: ${JSON.stringify(playerMoves)}\n\n`);    

    const USER_PREFS = getUserPrefs();
    const COMP_LETTER = (USER_PREFS.userLetter === 'X') ? 'O' : 'X';

    // add a prop for if user or computer isFirst in a round
    if (USER_PREFS.userLetter === 'X') { USER_PREFS.isFirst = true; }
    else { USER_PREFS.isFirst = false; }

    // not const because the board will change throughout the game
    let gameBoard = TTT_MODULE.board(USER_PREFS.boardWidth, USER_PREFS.boardWidth);
    console.log(TTT_MODULE.boardToString(gameBoard));
    
    let winnerLetter = TTT_MODULE.getWinnerCols(gameBoard) || TTT_MODULE.getWinnerDiagonals(gameBoard) || TTT_MODULE.getWinnerRows(gameBoard);

    while (!winnerLetter && !TTT_MODULE.isBoardFull(gameBoard)) {
        if (USER_PREFS.isFirst) {
            // user's move
            gameBoard = userMove(gameBoard, USER_PREFS.userLetter);
    
            // computer's turn
            gameBoard = compMove(gameBoard, COMP_LETTER);            
    
        }
        else {
            // computer goes first
            gameBoard = compMove(gameBoard, COMP_LETTER);
            gameBoard = userMove(gameBoard, USER_PREFS.userLetter);
    
        }

        winnerLetter = TTT_MODULE.getWinnerCols(gameBoard) || TTT_MODULE.getWinnerDiagonals(gameBoard) || TTT_MODULE.getWinnerRows(gameBoard);
                    
    }

    printWinnerDraw(gameBoard, winnerLetter, COMP_LETTER, USER_PREFS.userLetter);
    
}

mainGame();