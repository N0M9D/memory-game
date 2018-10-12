//get all the elements
const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
let resetBtn = document.querySelector(".restart");
const stars = document.querySelector(".stars");
let modalBody = document.querySelector(".modal-body");
let highScores = document.querySelector(".highScores");
let starRating="";
const playAgainBtn = document.querySelector(".play-again");
const startPlayBtn = document.querySelector(".start-game");
let gameTimer = document.querySelector(".game-timer");
let seconds = 0; let minutes = 0;
let secs = document.getElementById("seconds");
let mins = document.getElementById("minutes");
let userDisplay = document.querySelector(".userName");
let highScoreTable = " ";

let myTimer;
//checking if localstorage exists and store scores in an array
let scoresArray = localStorage.getItem('gameScores') ? JSON.parse(localStorage.getItem('gameScores')) : [];
localStorage.setItem("gameScores", JSON.stringify(scoresArray));
const scoreData = JSON.parse(localStorage.getItem("gameScores"));

//storing the names of the players in the array
let userNamesArray = localStorage.getItem('nameScores') ? JSON.parse(localStorage.getItem('nameScores')) : [];
localStorage.setItem("nameScores", JSON.stringify(userNamesArray));
const nameData = JSON.parse(localStorage.getItem("nameScores"));

//moves counter
let movesCount = 0;

//array to store open cards
const openCards = [];

//array to store matched cards
const matchCards = [];

//storing all the cards in an array
let cards = ['fas fa-gem','fas fa-paper-plane','fa fa-anchor','fa fa-bolt','fa fa-cube','fa fa-bomb','fa fa-leaf','fa fa-bicycle','fas fa-gem','fas fa-paper-plane','fa fa-anchor','fa fa-bolt','fa fa-cube','fa fa-bomb','fa fa-leaf','fa fa-bicycle'];

/*
 * Start the game
 */
getUserInfo();

//start the timer
//startTimer();
//startTheGame();

//starting the game
 function startTheGame(){
    //Generate the Grid with cards
    generateGameBoard();

    //select all the cards
    let card = document.querySelectorAll(".card");
    
    //go through each card and show them by click
    clickCards(card);
 }

 //get the user info function before starting the game
 function getUserInfo(){    
    $("#gameStartModal").modal('show');
    startPlayBtn.addEventListener('click', function(){
        $("#gameStartModal").modal('hide');
        if(document.getElementById('userNameInput').value){
            userDisplay.innerHTML = "Hi, <strong>"+document.getElementById('userNameInput').value+"</strong>";
            userNamesArray.push(document.getElementById('userNameInput').value);
            localStorage.setItem("nameScores", JSON.stringify(userNamesArray));
        }
        else {
            userDisplay.innerHTML = "Hi, <strong>guest</strong>";//if a player does not enter a name then use 'guest' as placeholder
        }
        startTimer();
        startTheGame();
    });
}


 //Timer function
 function startTimer(){
    myTimer = setInterval(function(){
        seconds++;
        secs.innerHTML = seconds;
        if(seconds<=9){
            secs.innerHTML = "0"+seconds;
        }
        if(seconds>=60){
    seconds = 0;
    minutes++;
    mins.innerHTML = "0"+minutes;
    }
    if(minutes>=60){
        minutes=0;
        hours++;
    }
     }, 1000);
    
 }

//clear the timer
function clearTimerData(){
    seconds = 0;
    minutes= 0;
    secs.innerHTML = "00";
    mins.innerHTML = "00";
    startTimer();
}


//generate card grid function
function generateGameBoard(){
        //Shuffle cards
        shuffle(cards);
    for(let i = 0; i < cards.length; i++){
        const lst = document.createElement("li");
        const icn = document.createElement("i");
        lst.classList.add("card");
        icn.className = cards[i]; //add each element of the array as a class of the "i" element
        lst.appendChild(icn); //append "i" element to the <li> element
        deck.appendChild(lst); //and at last append <li> elements to the <ul> to generate the card grid
    }
}

//Click the cards function
function clickCards(card){
    card.forEach(function(currentValue, indexOfCurrentValue, listObj){
        currentValue.addEventListener('click', function(){
            
            if(openCards.length === 1) {
                this.classList.add("open", "show", "unclickable");
                openCards.push(this);
                movesCounter();
                //Match condition: if the card currently being clicked is equal to the card already in the array then it will be a match
                matchTheCards(this, openCards[0]);
            } else {
               
                this.classList.add("open", "show", "unclickable");
                openCards.push(this);
            }
        });
        
    });
    
}

//Comparing the two cards in the openCards array for a match
function matchTheCards(currentCard, previousCard){
    if(currentCard.innerHTML === previousCard.innerHTML){
        currentCard.classList.add("match","unclickable");
        previousCard.classList.add("match", "unclickable");
        //adding matched cards to the match cards array
        matchCards.push(this, openCards[0]);

        //emptying the openCards array by setting its length to zero; this is done so that the next 2 cards can be moved in to be compared
        openCards.length = 0;
        //checking if game over
        gameOver(); //might have to do setTimeout here as well due to fast execution by js as the last card not shown being flipped
    }
    //If cards do not match
    else {
        currentCard.classList.add("nomatch");
        previousCard.classList.add("nomatch");
         //to delay the 2nd card being flipped over too fast by javascript
        setTimeout(function() {
        currentCard.classList.remove("open", "show", "unclickable", "nomatch");
        previousCard.classList.remove("open", "show", "unclickable", "nomatch");
        }, 800);
        openCards.length = 0;
    }
}

//Game over condition check function
function gameOver(){
    setTimeout(function() {
        if(cards.length === matchCards.length){
            clearInterval(myTimer);
            scoreModal(); //open the modal after the game is over
        }       
    }  , 250);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Reset the game by pressing Reset button
resetBtn.addEventListener('click',function(){
    //stop timer
    clearInterval(myTimer);
    //clear the timer data to zero
    clearTimerData();
    //reset all the stats
    resetGameStats();
    //Build the board again
    startTheGame();
    

});

//Reset game stats function
function resetGameStats(){
        //delete any cards in the matchCards array 
        matchCards.length = 0;

        //delete the current grid; if we do not do this then the new grid would be added to the current grid itself
        deck.innerHTML = "";
    
        //reset the moves counter to zero along with the counter display 
        moves.innerHTML = 0;
        movesCount = 0;
    
        //reset the star rating by resetting the stars
        stars.lastElementChild.innerHTML = "<i class=\"fas fa-star\"></i>";
        stars.firstElementChild.nextElementSibling.innerHTML = "<i class=\"fas fa-star\"></i>";
}

//moves count function
function movesCounter(){
    movesCount++;
    moves.innerHTML = movesCount;

        //Start the Rating System and pass the number of moves to the rating function
        ratingSystem(movesCount);
}

//Rating System
function ratingSystem(movesCount){

    if( movesCount <= 12 ){
        starRating = "3 stars";
        
    }
    else if( movesCount > 12 && movesCount <= 19 ){
        stars.lastElementChild.innerHTML = "<i class=\"far fa-star\"></i>";
        starRating = "2 stars";
        
    }
    else if( movesCount > 20 ){
        stars.firstElementChild.nextElementSibling.innerHTML = "<i class=\"far fa-star\"></i>";
        starRating = "1 star";
    }
}

//Modal content
function scoreModal(){
    
            //push the score into the localstorage array
            scoresArray.push(movesCount);
            localStorage.setItem("gameScores", JSON.stringify(scoresArray));
            
    modalBody.innerHTML = "<h5><strong>Congratulations! "+document.getElementById("userNameInput").value+", You Won!</strong></h5> <p>With "+movesCount+" moves and "+starRating+" in "+minutes+" m "+seconds+" s </p>\
    That's Udacious!";

    leaderBoard();
    $("#scoreModal").modal();
    playAgainBtn.addEventListener('click', function(){
        //push the same name of the player to the array if play again is pressed;splitting the string to get the name from the string "Hi, name"
        userNamesArray.push(userDisplay.innerText.split(", ")[1]);
        localStorage.setItem("nameScores", JSON.stringify(userNamesArray));
        
        $('#scoreModal').modal('hide');
        //stop timer
        clearInterval(myTimer);
        //reset timer data
        clearTimerData();
        //reset game data
        resetGameStats();
        //start the game again
        startTheGame();
    });
}

function leaderBoard(){
    
    highScores.innerHTML = '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Scores</th></tr></thead><tbody>'+addHighScores()+'</tbody></table>';
}

function addHighScores(){
    for(let i = 0; i < userNamesArray.length; i++){
        highScoreTable = highScoreTable + '<tr><th scope="row">'+(i+1)+'</th><td>'+userNamesArray[i]+'</td><td>'+scoresArray[i]+'</td></tr>';
    }
    return highScoreTable;
}
