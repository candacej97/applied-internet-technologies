
function refreshPage(visible, ...invisible) {
    // page starts out with intro being the only visible DOM element
    visible.classList.add('shown');
    invisible.forEach( el => {
        el.classList.add('hidden');
    });

    const emojiMeta = document.createElement('meta');
    emojiMeta.setAttribute('charset', 'UTF-8');
    document.querySelector('head').appendChild(emojiMeta);
}

// generate an 8x8 forest (NOTE not in 8x8)
function generateForest(userInput) {
    let forestArr = [];
    if (userInput.length > 0) {
        forestArr = userInput.split('');
        return forestArr;
    }

    // const emoji = '🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐒🐔🐧🐦🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🦋🐌🐞🐜🦗🕷🐢🐍🦎🦓🦌🦃🐓 🌱🌴🌳🌲🌿☘️🍀🍄🍃🍂🍁🌺🌻🌸🌼';
    const arrEmojiCodepoints = ['0x1F412', '0x1F98D', '0x1F436', '0x1F43A', '0x1F98A', '0x1F431', '0x1F981', '0x1F42F', '0x1F42E', '0x1F437', '0x1F417', '0x1F43F', '0x1F987', '0x1F43B', '0x1F428', '0x1F983', '0x1F98E', '0x1F40D', '0x1F338', '0x1F33A', '0x1F33B', '0x1F33C', '0x1F331', '0x1F332', '0x1F333', '0x1F334', '0x1F335', '0x1F344', '0x0020'];
    const length = arrEmojiCodepoints.length;

    // for (let i = 0; i < 8; i++) {
    //     forestArr[i] = [];
    //     for (let j = 0; j < 8; j++) {
    //         const rand = Math.floor(Math.random()*length);
    //         forestArr[i].push(arrEmoji[rand]);
    //     }
    // }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const rand = Math.floor(Math.random()*length);
            forestArr.push(arrEmojiCodepoints[rand]);
        }
    }

    return forestArr;
}

const simpsonsIndex = forest =>
  1 - Object.entries(
  [...forest.join("")].reduce(
      (counts, emoji) => ({...counts, [emoji]: (counts[emoji] || 0) + 1}),
      {}
  )
  ).reduce(([top, bottom], [species, count]) => [top + (count * (count - 1)+ (species-species)), bottom + count], [0, 0])
  .reduce((sumLilN,bigN) => sumLilN / (bigN * (bigN - 1)));


document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementsByTagName('button')[0];
    const intro = document.querySelector('#intro');
    const sim = document.querySelector('#sim');
    const pushtray = document.querySelector('#pushtray');

    refreshPage(intro, sim, pushtray);

    // if btn is clicked, the sim begins (reveal #sim, hide #intro)
    btn.addEventListener('click', () => {
        const userInput = document.querySelector('#inputForest').value;
        intro.classList.replace('shown', 'hidden');
        let forestArr = generateForest(userInput);
        
        // create DOM el to contain 8 rows of forest
        const div = document.createElement('div');
        div.setAttribute('id', 'forest');
        forestArr.forEach((el, index) => {            
            if (index % 8 === 0) {
                const br = document.createElement('br');
                div.appendChild(br);
            }

            const p = document.createElement('p');
            const txt = document.createTextNode(String.fromCodePoint(el));
            p.appendChild(txt);
            p.classList.add('emoji');
            p.setAttribute('id', index);
            div.appendChild(p);
        });

        const sIndex = simpsonsIndex(forestArr);
        const p = document.createElement('p');
        p.setAttribute('id', 'sIndex');
        p.appendChild(document.createTextNode(`The current Simpon's Index is: ${sIndex.toFixed(2)}`));

        sim.appendChild(p);
        sim.appendChild(div);

        // create new generate btn
        const generateBtn = document.createElement('button');
        const btnTxt = document.createTextNode('generate');
        generateBtn.appendChild(btnTxt);
        generateBtn.setAttribute('id', 'generateBtn');
        sim.appendChild(generateBtn);

        // show sim screen
        sim.classList.replace('hidden', 'shown');

        // create an array for pinned emoji to live
        const pinnedEmojiArr = [];

        // locate all emoji
        const emojiEl = document.querySelectorAll('.emoji');
        for (let i = 0; i < emojiEl.length; i++) {
            emojiEl[i].addEventListener('click', e => {                                
                // add clicked event if clicked already
                if (e.target.classList.contains('clicked')) {
                    // remove 'clicked' class
                    e.target.classList.remove('clicked');
                    // remove from pinned emoji array
                    pinnedEmojiArr[parseInt(e.target.id)] = null;
                } else {
                    e.target.classList.add('clicked'); 
                    // add to pinned emoji array
                    pinnedEmojiArr[parseInt(e.target.id)] = e.target.innerText.codePointAt(0);

                    /**
                        var icons = '🐹';
                        var cp = icons.codePointAt(0);
                        console.log(cp);
                        console.log(String.fromCodePoint(cp));
                     */
                }
            });            
        }

        function refreshSim (newForest) {
            // set newForest to current forestArr
            forestArr = newForest;

            // take pinned emoji and new forest and join them
            forestArr.forEach( (el, index) => {
                if (pinnedEmojiArr[index]) {
                    forestArr[index] = pinnedEmojiArr[index];
                }
            });
        
            // recalculate simpson index
            const sIndex = simpsonsIndex(forestArr);
        
            // input new forest and new simpson index into screen
            const div = document.querySelector('#forest');
            const p = document.querySelector('#sIndex');
        
            // create DOM el to contain 8 rows of forest
            const newDIV = document.createElement('div');
            newDIV.setAttribute('id', 'forest');
            forestArr.forEach((el, index) => {            
                if (index % 8 === 0) {
                    const br = document.createElement('br');
                    newDIV.appendChild(br);
                }
        
                const p = document.createElement('p');
                const txt = document.createTextNode(String.fromCodePoint(el));
                p.appendChild(txt);
                p.classList.add('emoji');
                p.setAttribute('id', index);

                if (pinnedEmojiArr[index]) {
                    p.classList.add('clicked');
                }

                newDIV.appendChild(p);
            });
        
            const newP = document.createElement('p');
            newP.setAttribute('id', 'sIndex');
            newP.appendChild(document.createTextNode(`The current Simpon's Index is: ${sIndex.toFixed(2)}`));
        
            // replace old div and p with new ones
            div.replaceWith(newDIV);
            p.replaceWith(newP);
        
        }
        
        // find new generateBtn & add event listener
        document.querySelector('#generateBtn').addEventListener('click', () => {
            // refresh the sim
            refreshSim(generateForest(''));

            // get sIndex
            const sIndex = document.querySelector('#sIndex');
            const ovrly = document.querySelector('#pushtray');
            // if its <= 0.7
            if (parseFloat(sIndex) <= 0.7) {
                // add a div to #pushtray el
                const div = document.createElement('div');
                const txt = document.createTextNode(`WARNING: Simpson's Index dropped to ${sIndex}`);
                div.appendChild(txt);
                ovrly.appendChild(div);
                // make #pushtray visible
                ovrly.classList.replace('hidden', 'shown');
            }
            // else make #pushtray el invisible
            else {
                ovrly.classList.replace('shown', 'hidden');
            }
        });
    });
});