////////////////////////////////////////////////////
// Mine Sweeper 
// August Bernberg
// 4/5/22
// ...

////////////////////////////////////////////////////
// Global Variables
const grid = document.querySelector(".grid")
let width = 10;
let bombCount = 20;
let squares = [];
let firstClick = true;
let selectedColor = 'red'

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let flagPlacement = bombCount;
 
let gameOver = false;

let maxOpening = Math.floor((width*width)/10); //for first click

// for showing and removing dirrections
const menu = document.getElementById('open-menu');
const exit = document.getElementById('exit')
let directions = document.getElementById('directions');

////////////////////////////////////////////////////
// Functions
 
let createBoard = function(){
    // creates x amount of squares with onclick events that when clicked will reveal a bomb or #
    for(var i = 0; i<width*width; i++){
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add('create');
        grid.appendChild(square);
        squares.push(square);
 
        square.addEventListener('click', function(){
            console.log('wokring');
            if(firstClick === true){ // first click will open up an area of blocks
                firstClickCreation(square); 
                firstClick = false;
            } else {
                click(square); // after first click, will check if bomb or if open space
            }
        })
    }
}
 
let setBombs = function(){
    let alreadyTaken = 0;
 
    for(let i = 0; i<width*width; i++){
        if(document.getElementById(i).classList.contains('first-click')){ alreadyTaken++ } // checks to see how many areas are already taken by your first click
    }
 
    // creates an array that will be pushed into each square's class so that latter the program will check if theirs a bomb or not
    const bombsArray = new Array(bombCount).fill('bomb');
    const safeArray = new Array(squares.length - bombCount - alreadyTaken).fill('open');
    const bombsafeArray = bombsArray.concat(safeArray);
    const shuffledArray = bombsafeArray.sort(() => Math.random()-0.5);
 
    for(let i = 0; i<width*width; i++){
        if(!document.getElementById(i).classList.contains('first-click')){
            document.getElementById(i).classList.add(shuffledArray[0]);
            shuffledArray.shift();
        }
    }
 
    setData();
}
 
let setData = function(){
    //looks around the square - checking 8 squares - to see if they have a bomb, if they do +1 to its displayed total

   for(var i = 0; i<width*width; i++){
        let surroundingBombs = 0;
        let square = document.getElementById(i);
        let leftSide = (parseInt(square.id)) % width === 0;
        let rightSide = (parseInt(square.id)+1) % width === 0;
 
        if(square.classList.contains('open') || square.classList.contains('first-click')){
            //check above
            if(!leftSide && i>width && document.getElementById(i-width-1).classList.contains('bomb')){ surroundingBombs++ }
            if(i>width-1 && document.getElementById(i-width).classList.contains('bomb')){ surroundingBombs++ }
            if(!rightSide && i>width-1 && document.getElementById(i-width+1).classList.contains('bomb')){ surroundingBombs++ }
            //check sides
            if(!leftSide && document.getElementById(i-1).classList.contains('bomb')){ surroundingBombs++ }
            if(!rightSide && document.getElementById(i+1).classList.contains('bomb')){ surroundingBombs++ }
            //check bottom
            if(!rightSide && i<squares.length-width-1 && document.getElementById(i+width+1).classList.contains('bomb')){ surroundingBombs++ }
            if(i<squares.length-width-1 && document.getElementById(i+width).classList.contains('bomb')){ surroundingBombs++ }
            if(!leftSide && i<squares.length-width && document.getElementById(i+width-1).classList.contains('bomb')){ surroundingBombs++ }
 
            square.setAttribute('data', surroundingBombs);
        }
        
        if(square.classList.contains('first-click')){
            square.innerText = square.getAttribute('data');
            if(square.getAttribute('data') === 0){
                mineless(square);
            }
       }
   }
}
 
let click = function(square){
    // return values to stop click eventlistener if their a reason it shouldnt be clicked(i.e. flag, gameover, already clicked...)

    if(gameOver == true){ return }
    if(square.classList.contains('first-click')){ return }
    if(square.classList.contains('flag-set')){ return }
    if(square.classList.contains('checked')){ return }
    square.classList.add('checked');
 
    let data = parseInt(square.getAttribute('data'));
 
    let placement = parseInt(square.id);
 
    // shows to the user either if the square they pushed is a bomb or an open space, if open gives it a number or...
    if(square.classList.contains('open')){
        square.innerText = data
        square.style.background = selectedColor;
        if(data !== 0){
            square.innerText = data;
        } else if(!square.classList.contains('first-click')){
            //does = 0, check around
            mineless(placement); // ... or it open up areas around the open space - until it reaches a space that has a number - if the data inside it is 0(no bombs around this square) 
        }
    } else {
        square.classList.add('lost');
        youLose(square);
    }
}
 
let mineless = function(placement){
    // if the data is 0, then it checks around until it finds a square with 1-7

    let leftSide = placement % width === 0;
    let rightSide = (placement+1) % width === 0;
    setTimeout(() => {
        //top
        if(!leftSide && placement>width && document.getElementById(placement-width-1).getAttribute('data') == 0 && !document.getElementById(placement-width-1).classList.contains('flag-set')){
            document.getElementById(placement-width-1).style.background = selectedColor;
            click(document.getElementById(placement-width-1));
        } else if(!leftSide && placement>width) {
            click(document.getElementById(placement-width-1));
        }
        if(placement>width-1 && document.getElementById(placement-width).getAttribute('data') == 0 && !document.getElementById(placement-width).classList.contains('flag-set')){
            document.getElementById(placement-width).style.background = selectedColor;
            click(document.getElementById(placement-width));
        } else if(placement>width-1) {
            click(document.getElementById(placement-width));
        }
        if(!rightSide && placement>width-1 && document.getElementById(placement-width+1).getAttribute('data') == 0 && !document.getElementById(placement-width+1).classList.contains('flag-set')){
            document.getElementById(placement-width+1).style.background = selectedColor;
            click(document.getElementById(placement-width+1));
        } else if(!rightSide && placement>width-1) {
            click(document.getElementById(placement-width+1));
        }
        //sides
 
        if(!leftSide && document.getElementById(placement-1).getAttribute('data') == 0 && !document.getElementById(placement-1).classList.contains('flag-set')){
            document.getElementById(placement-1).style.background = selectedColor;
            click(document.getElementById(placement-1));
        } else if(!leftSide) {
            click(document.getElementById(placement-1));
        }
        if(!rightSide && document.getElementById(placement+1).getAttribute('data') == 0 && !document.getElementById(placement+1).classList.contains('flag-set')){
            document.getElementById(placement+1).style.background = selectedColor;
            click(document.getElementById(placement+1));
        } else if(!rightSide) {
            click(document.getElementById(placement+1));
        }
        //bottom
        if(!leftSide && placement<(width*width)-width-1 && document.getElementById(placement+width-1).getAttribute('data') == 0 && !document.getElementById(placement+width-1).classList.contains('flag-set')){
            document.getElementById(placement+width-1).style.background = selectedColor;
            click(document.getElementById(placement+width-1));
        } else if(!leftSide && placement<(width*width)-width-1) {
            click(document.getElementById(placement+width-1));
        }
        if(placement<(width*width)-width && document.getElementById(placement+width).getAttribute('data') == 0 && !document.getElementById(placement+width).classList.contains('flag-set')){
            document.getElementById(placement+width).style.background = selectedColor;
            click(document.getElementById(placement+width));
        } else if(placement<(width*width)-width) {
            click(document.getElementById(placement+width));
        }
        if(!rightSide && placement<(width*width)-width && document.getElementById(placement+width+1).getAttribute('data') == 0 && !document.getElementById(placement+width+1).classList.contains('flag-set')){
            document.getElementById(placement+width+1).style.background = selectedColor;
            click(document.getElementById(placement+width+1));
        } else if(!rightSide && placement<(width*width)-width) {
            click(document.getElementById(placement+width+1));
        }
    }, 10)
 }
 
 
 
 
 
let firstClickCreation = function(square){
    // for first click to open up an area for the player so the game isnt impossible
    let randomSquare = Math.floor(Math.random() * 4);
    let sqrL = parseInt(square.id);
 
    // checks if the click is near the sides so the program doesnt return an error\
    // also return statement to end this function so it doesn't call itself infinitely if certain things have been met
    let leftSide = sqrL%width;
    let rightSide = sqrL%width + 1;
    if(leftSide === 0){
        square.classList.add('first-click');
        firstClickCreation(document.getElementById(sqrL+1));
        return;
    }
    if(rightSide === 10){
        square.classList.add('first-click');
        firstClickCreation(document.getElementById(sqrL-1));
        return;
    }
   
    let bottom = sqrL<width;
    let top = sqrL>(width*width)-width-1;
    if(bottom === true){
        square.classList.add('first-click');
        firstClickCreation(document.getElementById(sqrL+width))
        return;
    }
    if(top === true){
        square.classList.add('first-click');
        firstClickCreation(document.getElementById(sqrL-width))
        return;
    }
 
    if(maxOpening <= 0){ // set a set amount of space the first click can open
        setBombs();
        for(let i = 0; i<width*width; i++){
            let findNull = document.getElementById(i)
            if(findNull.getAttribute('data') == 0 && findNull.classList.contains('first-click')){
                findNull.setAttribute('data', 0);
                mineless(parseInt(findNull.id));
            }
        }
        return;
    } else {
        maxOpening--;
    }
    
    // more logic that sets a block: above, bellow, right, or left so theirs a random opening for the blocks
    setTimeout(() => {
        switch(randomSquare){
            case 0: 
                let newSquareW = document.getElementById(sqrL-width); // above
                if(newSquareW.classList.contains('first-click')){
                    firstClickCreation(newSquareW);
                    return;
                } else {
                    newSquareW.classList.add('first-click');
                    firstClickCreation(newSquareW);
                }
                break;
            case 1:
                let newSquareD = document.getElementById(sqrL-1) // right
                if(newSquareD.classList.contains('first-click')){
                    firstClickCreation(newSquareD);
                    return;
                } else {
                    newSquareD.classList.add('first-click');
                    firstClickCreation(newSquareD);
                }
                break;
            case 2:
                let newSquareS = document.getElementById(sqrL+width); // bellow
                if(newSquareS.classList.contains('first-click')){
                    firstClickCreation(newSquareS);
                    return;
                } else {
                    newSquareS.classList.add('first-click');
                    firstClickCreation(newSquareS);
                }
                break;
            case 3:
                let newSquareA = document.getElementById(sqrL+1); // left
                if(newSquareA.classList.contains('first-click')){
                    firstClickCreation(square);
                    return;
                } else {
                    newSquareA.classList.add('first-click');
                    firstClickCreation(newSquareA);
                }
                break;
        }
    }, 10)
}
 
let flagSet = function(event){ // sets a flag that prevents a person from clicking on a place they think is a bomb
    let target = event.target;
    // return statements to prevent errors
    if(gameOver == true){ return }
    if(!target.classList.contains('open') && !target.classList.contains('bomb')){ return }
 
    // creates the element/flag you'll place
    let img = document.createElement('img');
    img.src = 'images/flag-icon.png';
    img.style.width = '50%';
    img.style.height = '50%';
    img.setAttribute('data-price', target.id)

    if(!target.classList.contains('checked')){
        if(!target.classList.contains('flag-set')){
            if(flagPlacement <= 0){ return }
            flagPlacement--;
            target.classList.add('flag-set');
            target.appendChild(img);
            document.getElementById('bombs-left').innerText = `${flagPlacement}`;
            if(target.classList.contains('bomb')){
                bombCount--;
            }
        } else {
            target.classList.remove('flag-set')
            flagPlacement++;
            target.innerText = '';
            document.getElementById('bombs-left').innerText = `${flagPlacement}`;
            if(target.classList.contains('bomb')){
                bombCount++;
            }
        }
    }

    if(flagPlacement == 0 && bombCount !== 0){
        document.getElementById('bomb-counter').style.color = 'red'
    }
 
    let winPopup = document.getElementById('win-popup');
 
    if(bombCount === 0) { // check to see if a flag has been put on every bomb, if so then YOU WIN!!!
        gameOver = true;
        winPopup.classList.add('open-popup');
    }
}
 

let changePlayField = function(){   // allows user to change the field to what they want
    let sizeChange = document.getElementById('change-size');
    let data = sessionStorage.getItem('savesize');
    
    sizeChange.addEventListener('change', function(){
        changeFieldLogic(sizeChange);
    })

    if(data !== null){
        let newSizeChange = { value: data }
        directions.classList.add('remove-directions');
        changeFieldLogic(newSizeChange);
    } else {
        return
    }
}

let changeFieldLogic = function(sizeChange){
    // used so when user restarts, it save data to a chart then pulls from that and sets the field to that
    sessionStorage.setItem('savesize', sizeChange.value);
    sessionStorage.setItem('directionsopen', directions.classList.contains('remove-directions'))

    let fieldSize = parseInt(sizeChange.value);
    let maxBoxes = Math.floor(windowWidth/40);
    // if change is too big or too small it will autoset the size to a pre-set value to prevent mistakes 
    if(fieldSize<10){
        fieldSize = 10;
        sizeChange.value = '10'
    }
    if(fieldSize > maxBoxes){
        fieldSize = maxBoxes;
        sizeChange.value = ''+maxBoxes;
    }

    for(var i = 0; i<width*width; i++){ // removes all preplaced square so that theirs open space to replace a larger area of squares
        const remSquare = document.getElementById([i]);
        grid.removeChild(remSquare);
    }

    //math to reset the board
    grid.style.width = "" + fieldSize * 40 + "px";
    grid.style.background = 'grey'
    width = fieldSize;
    bombCount = Math.floor(fieldSize*fieldSize/5); // bombs will always be ~20% of total squares
    flagPlacement = bombCount;
    squares = [];
    createBoard();
}

let youLose = function(){ // stops any actions from happening and pops up a you lose banner
    gameOver = true;
    for(let i = 0; i<width*width; i++){
        let square = document.getElementById(i);
        if(square.classList.contains('bomb')){
            square.classList.add('lost');
            square.style.background = 'orange';
        }
    }
    setTimeout(() => {
        let popup = document.getElementById('popup');
        popup.classList.add('open-popup');
    }, 2000)
}

window.addEventListener('contextmenu', function(event){ // adds an event listener that checks for right clicking, or double clicking to set a flag
    event.preventDefault();
    if(event.target.tagName == 'IMG'){
        let newevent = {
            target: document.getElementById(event.target.getAttribute('data-price'))
        };
        flagSet(newevent);
    } else {
        flagSet(event);
    }
})

// shows and removes directions
menu.addEventListener('click', function(event){
    directions.classList.remove('remove-directions');
})
exit.addEventListener('click', function(event){
    directions.classList.add('remove-directions');
})

createBoard();
changePlayField();