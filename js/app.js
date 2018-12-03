/*
 * Create a list that holds all of your cards
 */
//Global Variables

//Selected Card Choices Array
let cardSelections = [];
let cardMoves = 0, matchCount = 0;
let seconds = 0, minutes = 0;
let timerStatus = 'stopped';
let timeCounter;
let starCounter = 3;
const pairs = 2;


document.querySelector('.restart-block').addEventListener("click", function(event) {
    newGame();
});
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

createDeck();

//Setup card deck and shuffle and apply to UL within HTML
function createDeck() {
    
    const deckList = document.querySelector('.deck');
    const cards = Array.from(document.querySelectorAll('.deck li'));
    cards.forEach(function(card){
        card.className = 'card';
        cards.push(card);
      });
   
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach(function(card) {     
       deckList.appendChild(card);
   });
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

function newGame() {
    stopTimer();
    matchCount = 0;
    
    starCount();
    let stars = document.querySelectorAll('.stars li i');
    stars[0].classList.remove('hide');
    stars[1].classList.remove('hide');
    stars[2].classList.remove('hide');
    starCounter = 0;

    cardSelections = [];
    cardMoves = 0
    let counter = document.querySelector('.moves');    
    counter.innerHTML = cardMoves;

    seconds = 0, minutes = 0;
    timerStatus = 'stopped';
    let resetTime = document.querySelector('.stop-watch');
    resetTime.innerHTML = '00:00'

    createDeck();    
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 //Adds event listener to LI clicks. Only applied to UL component.
document.querySelector('.deck').addEventListener("click", function(event) {
    if(timerStatus == 'stopped')
    {
        startTimer();
    }
	//Checks if clicked sibbling is a LI / Card Item
    if(event.target.classList.contains('card') && !event.target.classList.contains('match') && cardSelections.length < 2 && !cardSelections.includes(event.target)) {     
       
        displayCard(event.target);
        addCard(event.target);

        //Checking if array has two cards and not already selected card.
        if(cardSelections.length == 2)
        { 
            cardMatch();
            moveCounter();
            starCount();
            if(matchCount === pairs){
                         
                stopTimer();
             
                openFinishModal();          
            }
        }        
	}
});

//Flips selected card over.
function displayCard(currentCard) {
    currentCard.classList.toggle('open');
    currentCard.classList.toggle('show');
}

function moveCounter() {
   cardMoves++;
   let counter = document.querySelector('.moves');
   counter.innerHTML = cardMoves;
}

function starCount() {
    let stars = document.querySelectorAll('.stars li i');
   
    if(cardMoves >= 9 )
    {
        stars[0].classList.add('hide');
        starCounter = 2;
    }
    if (cardMoves >= 18)
    {
        stars[1].classList.add('hide');
        starCounter = 1;
    }
    if (cardMoves >= 24)
    {
        stars[2].classList.add('hide');
        starCounter = 0;
    }
}

let stopWatch = document.querySelector('.stop-watch');

function add() {
    
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            
        }
    }

    stopWatch.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    startTimer();
}

function startTimer() {    
    timeCounter = setTimeout(add, 1000);
    timerStatus = 'started';       
}

function stopTimer() {
    clearTimeout(timeCounter);    
}

//Save selected card to array for checking pairs.
function addCard(target) {
    cardSelections.push(target);
    
}

//Does a compare on two cards in selected card array
function cardMatch() {
    if(cardSelections[0].firstElementChild.className === cardSelections[1].firstElementChild.className) {
      
        //If a match adds the match class to each card in array
        cardSelections.forEach(function(card){
            card.classList.add('match');
           
        });
        matchCount++;
        cardSelections = [];
     
    }
    else {
        //If no match sets timeout on card flipping via toggle.
        setTimeout(function() {
            displayCard(cardSelections[0]);
            displayCard(cardSelections[1]);  
            cardSelections = [];        
        }, 800 );      
    }
}

function saveResult(){
    if (typeof(Storage) !== "undefined") {
    
        let leaderScores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
        let name = document.getElementById('name').value;

        if(name !== '') {
            leaderScores.push(cardMoves + ' ' + 'Moves - ' + name);
            localStorage.setItem('scores', JSON.stringify(leaderScores));
        }
    } else {
        console.log('No storage avaliable for Leaderboard!');
    }
}

document.querySelector('.show-leader').addEventListener("click", function(event) {
    openLeaderModal();
});

function openFinishModal(){
    finishModal.style.display = "inline-block";
    
    //let finalTime = document.querySelector('.stop-watch');
    let descriptionText = document.querySelector('.final-text');



   
    descriptionText.innerHTML = `Congratulations. ${cardMoves} moves. ${starCounter} stars. Time: ${ document.querySelector('.stop-watch').innerHTML}`;
    
    
    
}

// Get the modal
let finishModal = document.querySelector('.finish-modal');
let leaderModal = document.querySelector('.leader-modal');

// Get the <span> element that closes the modal
let finalClose = document.querySelector('.final-close');
let leaderClose = document.querySelector('.leader-close');


// When the user clicks on <span> (x), close the modal
finalClose.onclick = function() {
    saveResult();
    finishModal.style.display = "none";
    
    newGame();
    //Update Leaderboards
}

leaderClose.onclick = function() {
    leaderModal.style.display = "none";
    newGame();
    //Update Leaderboards
}


// When the user clicks anywhere outside of the modal, close it
/*window.onclick = function(event) {
    if (event.target == finishModal || event.target == leaderModal ) {
        finishModal.style.display = "none";
        leaderModal.style.display = "none";
        newGame();
        //UPdate leaderBoards
    }
   
}*/

function openLeaderModal(type){
    leaderModal.style.display = "inline-block";
    
  
    let ulLeader = document.querySelector('.leader-list');

    ulLeader.innerHTML = '';
    let scoresArray = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
scoresArray.sort();
    if(scoresArray){
        scoresArray.forEach(score => {
    
            let li = document.createElement('li');
            li.textContent = score;
            ulLeader.appendChild(li);
    
        })         

    }

}
