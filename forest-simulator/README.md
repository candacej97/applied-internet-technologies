# Forest Simulator

## Description

This web application is a emoji forest simulator; an interface that creates forests similar to the one that [this twitter bot](https://twitter.com/tiny_forests) generates by using pure clientside javascript where you can curate some parts of the forest, but also allow randomness to generate other parts. The interface will then compute the biodiversity of your forest in realtime using [Simpson's index](https://en.wikipedia.org/wiki/Diversity_index#Simpson_index) so you can see how sickly your forest is as you are generating it.

### Features

* pin a single emoji by clicking on it
* an alert shows in the top-right corner of the viewport when the Simpson's index is less than 0.7

## Built With

* NodeJS
    * express
    * path

## Run Instructions

```
git clone <GIT REPO URL>
cd <GIT REPO NAME>/forest-simulator
npm start
```

go to `localhost:3000` in a browser to view.

