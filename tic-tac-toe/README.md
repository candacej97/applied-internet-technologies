
# Tic Tac Toe

## Description

An interactive 2-player (computer vs human player) Tic Tac Toe game. The [rules on wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe).

This game was created in 2 parts. The first part was the building of serveral helper functions that was used in the second part as a module. The second part deals with implementing the game. It's a bit over-engineered 😅 (thanks to my professor).

### Objectives

1. Write some ES6
    * control structures
    * functions
    * higher order functions
    * Array and string manipulation
2. Learn how to run node programs
3. Learn about node built-ins:
    * process
    * exports
    * require
4. Install and use modules, create your own
5. Run unit tests to check your work
6. Use a static analysis tool (eslint) to help prevent bugs / errors

## Built With

* NodeJS
    * readline-sync

## Run Instructions

**__Node must be installed locally.__**

Inside the terminal:

```
git clone https://github.com/nyu-csci-ua-0480-001-003-fall-2018/candacej97-homework01.git
cd candacej97-homework01
npm install
```

### To play TIC TAC TOE in regular gameplay:
```
npm start
```

### To play TIC TAC TOE with scripted moves:
```
npm start <SCRIPTED MOVES AS A STRING OF TWO ARRAYS>
```

_The third argument configures the first few moves of the game for the computer and the player respectfully. An example command would be:_ `node src/game.js "[[[0,0],[0,1],[0,2]], [[1,0],[1,1]]]"`