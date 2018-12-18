// tic-tac-toe.js

/**
 * @param {*} rows 
 * @param {*} columns 
 * @param {*} initialCellValue (optional), should be defaulted to ""
 * @returns a single dimensional Array containing the number of elements that would be in a rows x columns board… with each cell containing the initial value, initialCellValue
 */
function board(rows, columns, initialCellValue) { // modify parameters to allow for default values
    let arr;
    if (rows < 1 || columns < 1) {
        arr = new Array(1);
    }
    else {
        arr = new Array(rows * columns);
    }

    if (initialCellValue) {
        arr.fill(initialCellValue);
        return arr;
    } else {
        arr.fill("");
        return arr;
    }
}

/**
 * @param {*} board 
 * @param {*} row 
 * @param {*} col 
 * @returns a Number, the index that's mapped to by the given row and col
 * 
 */
function toIndex(board, row, col) {
    return (Math.sqrt(board.length) * row) + col;
}

/**
 * @param {*} board 
 * @param {*} i 
 * @returns an object containing two properties, row and col, representing the row and column numbers that the index maps to
 */
function toRowCol(board, i) {
    
    let rowVal = 0;
    let colVal = -1;
    let index = Number(i);
    let addition = 0;

    if (i <= Math.floor(Math.sqrt(board.length)) - 1) {
        rowVal = 0;
        colVal = i;
    }
    else {
        while (index > 0) {
            index-=Math.floor(Math.sqrt(board.length));
            if (index > 0 && index <= Math.floor(Math.sqrt(board.length)) - 1) {
                addition = index;
            }
            rowVal++;
            colVal++;
        }
        colVal += addition;
    }


    return {"row": rowVal, "col": colVal};
}

/**
 * @param {*} board 
 * @param {*} letter 
 * @param {*} row 
 * @param {*} col 
 * @returns a single dimensional Array representing the board where the cell at row and col is set to the value of letter
 */
function setBoardCell(board, letter, row, col) {
    let newArr = Array.from(board);
    newArr[toIndex(newArr, row, col)] = letter;
    return newArr;
}

/**
 * @param {*} algebraicNotation 
 * @returns an object containing two properties, row and col, representing the row and column numbers that the algebraicNotation maps to (for example, {"row": 1, "col": 1}). undefined if the algebraic notation passed in is not valid.
 */
function algebraicToRowCol(algebraicNotation) {
    const LETTER = algebraicNotation.charAt(0).toLowerCase();
    const NUMBER = algebraicNotation.slice(1, algebraicNotation.length);

    if (NUMBER.length === 0) { return undefined; }
    for (let index = 0; index < NUMBER.length; index++) {
        if(NUMBER[index] === " " || isNaN(NUMBER[index])) { return undefined; }
    }

    if (LETTER >= "a" && LETTER <= "z" || LETTER >= "A" && LETTER <= "Z") {
        return {"row": LETTER.charCodeAt(0) - 'a'.charCodeAt(0), "col": NUMBER-1};
    }

    return undefined;
}

/**
 * @param {*} board 
 * @param {*} args
 * @returns a single dimensional Array representing the board where the cell at row and col is set to the value of letter
 */
function placeLetters(board, ...args) { 
    const LIMIT = args.length;
    let currBoard = Array.from(board);
    let LETTER = "";
    let A_NOTATION = "";

    for (let i = 0; i < LIMIT; i+=2) {
        
        if (i === (LIMIT-1)) {
            
            LETTER = args[i];
            A_NOTATION = args[i-1];

            if (isValidMove(board, algebraicToRowCol(A_NOTATION).row, algebraicToRowCol(A_NOTATION).col)) {
                currBoard = setBoardCell(currBoard, LETTER, algebraicToRowCol(A_NOTATION).row, algebraicToRowCol(A_NOTATION).col);
            }
            else {
                continue;
            }
        }
        else if (LIMIT%2 === 0) {
            LETTER = args[i];
            A_NOTATION = args[i+1];    

            if (isValidMove(board, algebraicToRowCol(A_NOTATION).row, algebraicToRowCol(A_NOTATION).col)) {
                currBoard = setBoardCell(currBoard, LETTER, algebraicToRowCol(A_NOTATION).row, algebraicToRowCol(A_NOTATION).col);
            }
            else {
                continue;
            }
        }        
    }
    return currBoard;
}

/**
 * @param {*} board 
 * @returns a String representation of the board
 */
function boardToString(board) {
    let str = "  ";
    const SIDE_LENGTH = Math.sqrt(board.length);
    const END_OF_LINE_BORDER = "\n   +";
    const BORDER = "---+";

    // top column numbers
    for (let i = 1; i < SIDE_LENGTH+1; i++) {
        str += "   " + i.toString();
    }
    str += "  ";
    let indexCount = 0;
    board.forEach(el => {
        // @ a new line
        if(indexCount % SIDE_LENGTH === 0) {
            str += END_OF_LINE_BORDER + BORDER.repeat(SIDE_LENGTH) + "\n ";
            str += String.fromCharCode('A'.charCodeAt(0) + (indexCount/SIDE_LENGTH)) + " |";
        }

        if(el === "") {
            str += "   |";
        }
        else {
            str += " " + el.slice(0,1) + " |";
        }
        indexCount++;
    });

    str+= END_OF_LINE_BORDER + BORDER.repeat(SIDE_LENGTH) + "\n";
    return str;
}

/**
 * @param {*} board 
 * @returns the letter of the winning player or undefined if there is no winner yet (based on rows)
 */
function getWinnerRows(board) {
    const PLAYER_X = "X";
    let tallyX = 0;
    const PLAYER_O = "O";
    let tallyO = 0;
    const SIDE_LENGTH = Math.sqrt(board.length)

    for (let index = 0; index < board.length; index++) {
        if (tallyX === SIDE_LENGTH || tallyO === SIDE_LENGTH) { break; }
        if (index%Math.sqrt(board.length) === 0) {
            tallyX = 0;
            tallyO = 0;
        }
        if (board[index] === PLAYER_X) { tallyX++; }
        if (board[index] === PLAYER_O) { tallyO++; }
    }

    if (tallyX === SIDE_LENGTH) { return PLAYER_X; }
    if (tallyO === SIDE_LENGTH) { return PLAYER_O; }
    else { return undefined; }
}

/**
 * @param {*} board 
 * @returns the letter of the winning player or undefined if there is no winner yet (based on columns)
 */
function getWinnerCols(board) {
    const PLAYER_X = "X";
    let tallyX = 0;
    const PLAYER_O = "O";
    let tallyO = 0;
    const SIDE_LENGTH = Math.sqrt(board.length);

    let sideCounter = 0;
    let indexPosition = 0;

    while (sideCounter < SIDE_LENGTH) {
        
        for (indexPosition; indexPosition < board.length; indexPosition+=SIDE_LENGTH) {
            if(board[indexPosition] === PLAYER_X) { tallyX++; }
            if(board[indexPosition] === PLAYER_O) { tallyO++; }
        }

        if (tallyX === SIDE_LENGTH || tallyO === SIDE_LENGTH) { break; } 
        else {
            tallyX = 0;
            tallyO = 0;
            indexPosition = sideCounter+1;
        }

        sideCounter++;

    }
    
    if (tallyX === SIDE_LENGTH) { return PLAYER_X; } 
    else if (tallyO === SIDE_LENGTH) { return PLAYER_O; }
    else { return undefined; }

}

/**
 * @param {*} board 
 * @returns the letter of the winning player or undefined if there is no winner yet (based on diagonals)
 */
function getWinnerDiagonals(board) {
    const PLAYER_X = "X";
    let tallyX = 0;
    const PLAYER_O = "O";
    let tallyO = 0;
    const SIDE_LENGTH = Math.sqrt(board.length);

    let indexPosition = 0;

        
    for (indexPosition; indexPosition < board.length; indexPosition+=SIDE_LENGTH+1) {
        if(board[indexPosition] === PLAYER_X) { tallyX++; }
        if(board[indexPosition] === PLAYER_O) { tallyO++; }
    }

    if (tallyX === SIDE_LENGTH || tallyO === SIDE_LENGTH) {
        if (tallyX === SIDE_LENGTH) { return PLAYER_X; } 
        else if (tallyO === SIDE_LENGTH) { return PLAYER_O; }    
    } 
    else {
        tallyX = 0;
        tallyO = 0;
        indexPosition = SIDE_LENGTH-1;
    }

    for (indexPosition; indexPosition < board.length; indexPosition+=SIDE_LENGTH-1) {
        if(board[indexPosition] === PLAYER_X) { tallyX++; }
        if(board[indexPosition] === PLAYER_O) { tallyO++; }
    }

    if (tallyX === SIDE_LENGTH) { return PLAYER_X; } 
    else if (tallyO === SIDE_LENGTH) { return PLAYER_O; }
    else { return undefined; }

}

/**
 * @param {*} board 
 * @returns true if there are no empty cells left in the board, false otherwise
 */
function isBoardFull(board) {
    let isBoardFull = true;
    for (let index = 0; index < board.length; index++) {
        if (board[index] === "") {
            isBoardFull = false;
        }        
    }
    return isBoardFull;
}

/**
 * @param {*} board 
 * @param {*} row 
 * @param {*} col 
 * @returns true if the move is valid, false otherwise
 */
function isValidMove(board, row, col) {
    if (board[toIndex(board, row, col)] === "") { return true; }
    else { return false; }
}

/**
 * @param {*} board 
 * @param {*} algebraicNotation 
 * @returns true if the move is valid, false otherwise
 */
function isValidMoveAlgebraicNotation(board, algebraicNotation) {
    if (isValidMove(board, algebraicToRowCol(algebraicNotation).row, algebraicToRowCol(algebraicNotation).col)) { return true; }
    else { return false; }
}

/**
 * @param {*} board 
 * @returns index of an empty square on the board, undefined if the board is full
 */
function getRandomEmptyCellIndex(board) {
    if(isBoardFull(board)) { return undefined; }
    let EMPTY_INDEXES = [];
    for (let index = 0; index < board.length; index++) {
        if (board[index] == "") {
            EMPTY_INDEXES.push(index);    
            console.log(`empty at ${index}`);
                    
        }
    }

    return EMPTY_INDEXES[Math.floor(Math.random() * EMPTY_INDEXES.length)];
}

module.exports = {
    board: board,
    toIndex: toIndex,
    toRowCol: toRowCol,
    setBoardCell: setBoardCell,
    algebraicToRowCol: algebraicToRowCol,
    placeLetters: placeLetters,
    boardToString: boardToString,
    getWinnerRows: getWinnerRows,
    getWinnerCols: getWinnerCols,
    getWinnerDiagonals: getWinnerDiagonals,
    isBoardFull: isBoardFull,
    isValidMove: isValidMove,
    isValidMoveAlgebraicNotation: isValidMoveAlgebraicNotation,
    getRandomEmptyCellIndex: getRandomEmptyCellIndex
};