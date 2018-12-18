// scrabble.js
const READLINE = require('readline');
const FS = require('fs');

// set up a readline object that can be used for gathering user input
const userPrompt = READLINE.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ask a question
userPrompt.question("What letters are on your scrabble board?\n> ", handleUserInput);

// scrabble letter values
const LETTER_VALUES = { 
    "E": 1, "A": 1, "I": 1, "O": 1, "N": 1, "R": 1, "T": 1, "L": 1, "S": 1, "U": 1, 
    "D": 2, "G": 2, "B": 3, "C": 3, "M": 3, "P": 3, "F": 4, "H": 4, "V": 4, "W": 4, 
    "Y": 4, "K": 5, "J": 8, "X": 8, "Q": 10, "Z": 10 
};

// the callback function that's run when the readline object receives input
function handleUserInput(response) {
    console.log("Let's find some words to make with: " + response);

    // read file of scrabble words
    FS.readFile("data/enable1.txt", "utf8", function(err, data) {
        if (err) {
            console.log("Uh oh, there's an error called: ", err.name); 
        } else {
            // each word in one index
            const DATA_ARRAY = data.split("\n");
            let goodWords = [];
            DATA_ARRAY.forEach( (word, index) => {
                let str = response.split("");            
                let letters = word.split("");
                let goodLetters = letters.filter(letter => { if(letter === str){ return true } else { return false } });
                if (goodLetters.length === letters.length) {
                    goodWords.push(word);
                }
            });

            console.log(`goodWords: ${goodWords.length}`);
            
        }
    });




    userPrompt.close();
}
