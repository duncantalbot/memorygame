/*
 * Create a list that holds all of your cards
 */
//Global Variables

//Selected Card Choices Array
let cardSelections = [];
let cardMoves = 0;
let startStopWatch = true;
let stopWatchTime = 0;
let timerID;


document.querySelector('.restart').addEventListener("click", function(event) {
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
    //stop timer.
    console.log('New Game');
    clearInterval(timerID);
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

	//Checks if clicked sibbling is a LI / Card Item
    if(event.target.classList.contains('card') && !event.target.classList.contains('match') && cardSelections.length < 2 && !cardSelections.includes(event.target)) {     
        if(startStopWatch)
        {
            updateStopWatch();
            timerStarted = false;
        }
        displayCard(event.target);
        addCard(event.target);

        //Checking if array has two cards and not already selected card.
        if(cardSelections.length == 2)
        { 
            cardMatch();
            moveCounter();
            starCount();
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
    console.log(stars);
    if(cardMoves >= 9 )
    {
        stars[0].classList.add('hide');
    }
    if (cardMoves >= 18)
    {
        stars[1].classList.add('hide');
    }
    if (cardMoves >= 24)
    {
        stars[2].classList.add('hide');
    }
}

function updateStopWatch() {

   timerID = setInterval(function() {
        stopWatchTime ++ ;
console.log(stopWatchTime);
    }, 1000);

    const timer = document.querySelector('.stop-watch')
    console.log(timer);
    timer.innerHTML = stopWatchTime;
}


//Save selected card to array for checking pairs.
function addCard(target) {
    cardSelections.push(target);
    console.log(cardSelections);
}

//Does a compare on two cards in selected card array
function cardMatch() {
    if(cardSelections[0].firstElementChild.className === cardSelections[1].firstElementChild.className) {
      
        //If a match adds the match class to each card in array
        cardSelections.forEach(function(card){
            card.classList.add('match');
        });
        cardSelections = [];
    }
    else {
        //If no match sets timeout on card flipping via toggle.
        setTimeout(function() {
            displayCard(cardSelections[0]);
            displayCard(cardSelections[1]);  
            cardSelections = [];        
        }, 200 );      
    }
}