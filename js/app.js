(function(){
    'use strict';

    //Global Variables
    //list that holds all cards from UI, keeps changing.
    const cards = [];

    //Selected Card Choices Array
    let cardSelections = [];

    //Counters for number moves and card matches
    let cardMoves = 0, matchCount = 0;

    //Timer variables
    let seconds = 0, minutes = 0;

    //Value for checking if timer running
    let timerStatus = false;
    let timeCounter;

    //NUmbers stars to show
    let starCounter = 3;

    // Number card pairs required to win
    const cardPairs = 8;

    init();

    // Initial add refresh / restart button click and create deck
    function init() {
        /*Add click event to refresh / restart button*/
        document.querySelector('.restart').addEventListener("click", function(event) {
            refreshGame();
        });
        createDeck();
    }

    // Setup card deck and shuffle and apply to UL within HTML
    function createDeck() {
        const deckList = document.querySelector('.deck');

        //Create list of cards from UI
        let loadCards = Array.from(document.querySelectorAll('.deck li'));
        loadCards.forEach(function(card) {
            //Overwrite any existing show open classes.
            card.className = 'card';
            cards.push(card);
        });

    //Shuffle card pack
        const shuffledCards = shuffle(cards);

        //Add shuffled cards to UI grid
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

    // Refresh game / new game
    function refreshGame() {
        //Reset timer and variables
        clearTimer();
        //Reset card selections / moves / UI
        clearCards();
        //Clean up stars and show all
        clearStars();
        //Create new deck and shuffle to UI
        createDeck();
    }

    // Resets timer / stopwatch
    function clearTimer() {
        stopTimer();
        seconds = 0; 
        minutes = 0;
        timerStatus = false;
        let resetTime = document.querySelector('.timer');
        resetTime.innerHTML = '00:00';
    }

    // Shows all stars that have been hidden
    function clearStars() {
        starCount();
        let stars = document.querySelectorAll('.stars li i');
        stars[0].classList.remove('hide');
        stars[1].classList.remove('hide');
        stars[2].classList.remove('hide');
        starCounter = 0;
    }

    // Resets card counters and selections array
    function clearCards() {
        matchCount = 0;
        cardSelections = [];
        cardMoves = 0;
        let counter = document.querySelector('.moves');
        counter.innerHTML = cardMoves;
    }

    // Adds event listener to LI clicks. Only applied to UL component. Better performance.
    document.querySelector('.deck').addEventListener("click", function(event) {
        // Checks if timer running or not. If not starts when card clicked.
        if(!timerStatus) {
            startTimer();
        }
        // Checks if clicked sibbling is a LI / Card Item and not a match
        if(event.target.classList.contains('card') && !event.target.classList.contains('match') 
        && cardSelections.length < 2 && !cardSelections.includes(event.target)) {

            displayCard(event.target);
            addCard(event.target);

            // Checking if array has two cards and not already selected card.
            if(cardSelections.length == 2) {
                // Has a pair now check for match.
                cardMatch();
                moveCounter();
                starCount();

                if(matchCount === cardPairs) {
                    stopTimer();
                    openFinishModal();
                }
            }
        }
    });

    // Flips selected card over.
    function displayCard(currentCard) {
        currentCard.classList.toggle('open');
        currentCard.classList.toggle('show');
    }

    // Save selected card to array for checking matches.
    function addCard(target) {
        cardSelections.push(target);
    }

    // Does a compare on two cards in selected card array / if match adds class and increments match count.
    function cardMatch() {
        if(cardSelections[0].firstElementChild.className === cardSelections[1].firstElementChild.className) {
            // If a match adds the match class to each card in array
            cardSelections.forEach(function(card){
                card.classList.add('match');
            });
            matchCount++;
            cardSelections = [];
        } else {
            // If no match sets timeout on card flipping via toggle.
            setTimeout(function() {
                displayCard(cardSelections[0]);
                displayCard(cardSelections[1]);
                cardSelections = [];
            }, 400 );
        }
    }

    // Counts number of moves taken / updates UI
    function moveCounter() {
        cardMoves++;
        let counter = document.querySelector('.moves');
        counter.innerHTML = cardMoves;
    }

    // Removes stars based on moves
    function starCount() {
        let stars = document.querySelectorAll('.stars li i');

        switch (true) {
            case ( cardMoves >= 24):
                stars[2].classList.add('hide');
                starCounter = 0;
                break;
            case (cardMoves >= 18):
                stars[1].classList.add('hide');
                starCounter = 1;
                break;
            case (cardMoves >= 9):
                stars[0].classList.add('hide');
                starCounter = 2;
                break;
            default:
                starCounter = 3;
        }
    }

    // Adds time to stopwatch UI
    function addTime() {
        let timer = document.querySelector('.timer');

        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
            }
        }
        timer.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

        startTimer();
    }

    // Start stopwatch timer / counter
    function startTimer() {
        timeCounter = setTimeout(addTime, 1000);
        timerStatus = true;
    }

    // Stop stopwatch timer / counter
    function stopTimer() {
        clearTimeout(timeCounter);
    }

    // Saves results to local storage if username entered
    function saveResult() {
        // Checks if local storage supported
        if (typeof(Storage) !== "undefined") {

            let leaderScores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
            let nameValue = document.querySelector('.finish-input-field').value;
            let timer = document.querySelector('.timer').innerHTML;

            if(nameValue !== '') {
                leaderScores.push(`${cardMoves} ${timer} ${starCounter} ${nameValue}`);
                localStorage.setItem('scores', JSON.stringify(leaderScores));
            }
        }
    }

    // Add click event to leaderboard link
    document.querySelector('.leader-header').addEventListener("click", function(event) {
        openLeaderModal();
    });

    // Finishing score modal / accepts name to save to leaderboard / no name no save
    function openFinishModal() {
        finishModal.classList.remove('hide');
        finishModal.classList.add('show');
        let descriptionText = document.querySelector('.finish-text');

        // Clear previous information and reset form
        descriptionText.innerHTML = '';

        let finishInputText = document.querySelector('.finish-input-field');
        finishInputText.value = "";

        descriptionText.innerHTML = `<span>${cardMoves} Move(s) </br>${ document.querySelector('.timer').innerHTML} Time </br>${starCounter} Star(s)</span>`;
    }

    // Get the modal
    const finishModal = document.querySelector('.finish-modal');
    const leaderModal = document.querySelector('.leader-modal');

    // Get the <span> element that closes the modal and submit buttons
    const finishClose = document.querySelector('.finish-close');
    const leaderClose = document.querySelector('.leader-close');
    const finishReplay =document.querySelector('.finish-replay-btn');

    // Apply click event and hide finish modal, calls function to start new game
    finishReplay.addEventListener("click", function(event) {
        finishModal.classList.remove('show');
        finishModal.classList.add('hide');
        saveResult();
        refreshGame();
    });

    // Applys click event and closes the finish modal
    finishClose.addEventListener("click", function(event) {
        finishModal.classList.remove('show');
        finishModal.classList.add('hide');
        saveResult();
        refreshGame();
    });

    // Adds click event and closes the leader modal
    leaderClose.addEventListener("click", function(event) {
        leaderModal.classList.remove('show');
        leaderModal.classList.add('hide');
        refreshGame();
    });

    // Opens leaderboard mnodal and calls function to display results from local storage
    function openLeaderModal(type) {
        leaderModal.classList.add('show');
        leaderModal.classList.remove('hide');

        // Get results from local storage
        let scoresArray = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : [];
        let leaderArray = [];

        // Split storage string result into array elements
        if(scoresArray) {
            scoresArray.forEach(score => {
                let scoresSplit = score.split(" ");
                leaderArray.push(scoresSplit);
            });
        }

        // Call sort to order by best score.
        leaderArray = sortArray(leaderArray);

        // Load final results to UI
        loadLeaderResults(leaderArray);
    }

    // Format array results to Unordered list
    function loadLeaderResults(arr) {
        // Clear any current leaderboard results from UI
        let olLeader = document.querySelector('.leader-list');
        olLeader.innerHTML = '';

        if(arr) {
            let gamerName = '';
            arr.forEach(score => {
                // Checks if name has firstname surname
                if(score.length === 5) {
                    gamerName = score[3] + ' ' + score[4];
                }
                else{
                    gamerName = score[3];
                }
                // Creates html string for li item
                let htmlScore = `<span class="leader-name"><strong>${gamerName} - 
                ${score[0]} Move(s)</strong></span></br><span class="leader-stats">Time: ${score[1]} - ${score[2]} Star(s)</span>`;
                let li = document.createElement('li');
                li.innerHTML = htmlScore;
                olLeader.appendChild(li);
            });
        }
    }

    // Sort array function
    function sortArray(arr) {
        arr.sort(function(as,bs) {
            return as[0] - bs[0];
        });
        return arr;
    }

})();









