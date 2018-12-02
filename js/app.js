/*
 * Create a list that holds all of your cards
 */
//Global Variables

//Selected Card Choices Array
let cardSelections = [];
let cardMoves = 0;
let timeCounter = 0;


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
        timer();
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

function add() {
    let stopwatch = document.querySelector('.stop-watch');
    let seconds = 0, minutes = 0, hours = 0;
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    stopwatch.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
}

function timer() {
    timeCounter = setTimeout(add, 1000);
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
        finishModal.style.display = "block";
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

// Get the modal
let finishModal = document.querySelector('.finish-modal');

// Get the button that opens the modal
let openModal = document.querySelector('.open-modal');

// Get the <span> element that closes the modal
let closeModal = document.querySelector('.close-modal');

// When the user clicks on the button, open the modal 
openModal.onclick = function() {
    finishModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
    finishModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == finishModal) {
        finishModal.style.display = "none";
    }
}