
//A list that holds all of the icons
const cardsDeck = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];

//Declare all variables and arrays used
const cardsContainer = document.querySelector('.deck');
const movesSpan = document.querySelector('.moves');
const starsContainer = document.getElementById('stars');
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const overlay = document.querySelector('.overlay');
const popUp = document.querySelector('.popup');
const playAgain = document.querySelector('.pop-restart');
const popStars = document.querySelector('.pop-stars');
const popTime = document.querySelector('.pop-time');
var openCards = [];
var matchedCards = [];
var moves = 0;
var failedMoves = 0;
var timerInstances = 0;
var interval = 0;
var totalSeconds = 0;

addStars();

//Shuffle array of icons before displaying the to the newly opened page
addCards(shuffle(cardsDeck));

//Loop through each card and create its HTML
function addCards(cards) {
  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.innerHTML = '<i class="' + cards[i] + '"></i>';
    //add each card's HTML to the page
    cardsContainer.appendChild(card);

    //  set up the event listener for when a card os clicked
    card.addEventListener('click', function() {
      var length = openCards.length;
      if (timerInstances === 0) {
        timerInstances++;
        interval = setInterval(setTime, 1000);
        console.log("START INTERVAL", interval);
      }
      //Adding clicked cards to the openCards array, limiting maximum number of card in the array to 2
      if (length < 2) {
        //Exclude already matched cards from being compared again
        if (!card.classList.contains('matched')) {
          //check if the card clicked is different from the first added to 'openCards'. To avoid match card to itself
          if(!openCards.includes(this)){
            // display the card's symbol + animate
            card.classList.add('open', 'show', 'animate', 'flipInY');
            // Add the card to a *list* of "open" cards
            openCards.push(this);
            //When open Cards has two elements, compare them
            if (length === 1) compareCards();
          }
        }
      }

      //Compare open cards function
      function compareCards() {
        incrementMoves();
        console.log(failedMoves);
        if (openCards[0].innerHTML === openCards[1].innerHTML) {
          //console.log('its a match!');
          for (let k = 0; k < openCards.length; k++) {
            openCards[k].classList.add('matched');
            matchedCards.push(openCards[k]);
          }
          resetCards();
          resetFailedMoves();
          console.log(matchedCards);

          //If the cards do not match, remove the cards from the list and hide the card's symbol
        } else {
          //console.log('try again!');
          setTimeout(hideCards, 1500);
        }
      }
      //if all cards have matched, display a message with the final score
      if (matchedCards.length === 16) {
        console.log("STOP INTERVAL", interval);
        clearInterval(interval);
        //console.log("You won!!");
        console.log("Your time:", getTime());
        setPopupValues(countStars(), getTime());
        displayPopup();
      }

    });

  }
}


//Create the initial 3 stars rating and add HTML elements
function addStars() {
  for (let n = 0; n < 3; n++) {
    let star = document.createElement('li');
    star.innerHTML = '<i class="fa fa-star"></i>';
    starsContainer.appendChild(star);
  }
}


//Hide card icons
function hideCards() {
  for (let j = 0; j < openCards.length; j++) {
    let currentElement = openCards[j];
    currentElement.classList.remove('open', 'show');
  }
  resetCards();
  incrementFailedMoves();
}

//Reset open cards array
function resetCards() {
  openCards = [];
}

//Increment moves counter
function incrementMoves() {
  moves++;
  movesSpan.innerHTML = moves;
}

//Increment failed moves. If more than 6 consecutive failed moves, remove a star
function incrementFailedMoves() {
  failedMoves++;
 //Make sure a star is left no matter how many failed moves.
  if (failedMoves === 6 && starsContainer.childNodes.length >1) {
    resetFailedMoves();
    if (starsContainer.firstElementChild) {
      starsContainer.removeChild(starsContainer.firstElementChild);
    }
  }
}

//Reset failed moves counter when a match is found
function resetFailedMoves() {
  failedMoves = 0;
}

//Reset moves counter in pop-up window
function resetMoves() {
  moves = 0;
  movesSpan.innerHTML = moves;
}

//Compare card with already matched array
function isMatched(element) {
  let result = false;
  for (let m = 0; m < matchedCards.length; m++) {
    if (element === matchedCards[m]) {
      result = true;
    }
  }
  return result;
}

//Reset matched card array
function resetMatchedCards() {
  matchedCards = [];
}

//Add timer
function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

//Add 0 in front of number <9
function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

//Get time passed
function getTime() {
  let seconds = secondsLabel.innerHTML;
  let minutes = minutesLabel.innerHTML;
  return minutes + ":" + seconds;
}

//Reset timer
function resetTime() {
  secondsLabel.innerHTML = pad(0);
  minutesLabel.innerHTML = pad(0);
  interval = 0;
  timerInstances = 0;
  totalSeconds = 0;
}

//Create the winning pop-up stars
function addPopStars(number) {
  for (let n = 0; n < number; n++) {
    let star = document.createElement('li');
    star.innerHTML = '<i class="fa fa-star"></i>';
    popStars.appendChild(star);
  }
}

//Reset stars to 0. Used when playing again to avoid adding too many stars
function resetStars() {
  starsContainer.innerHTML = "";
  addStars();
}

//Count how many stars in a stars container
function countStars() {
  return starsContainer.childNodes.length;
}

//Shuffle the list of cards
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Replace cards with shuffled cards
function replaceCards(array) {
  cardsContainer.innerHTML = "";
  let shuffledDeck = shuffle(array);
  addCards(shuffledDeck);
}

//Reset all values: timer, moves, stars, hide cards,failed moves counter; clear matched cards array
function resetValues() {
  clearInterval(interval);
  resetTime();
  hideCards();
  resetCards();
  resetFailedMoves();
  resetMoves();
  resetStars();
  resetMatchedCards();
}

//Show pop-up
function displayPopup() {
  overlay.classList.add('active');
  popUp.classList.add('active');
}

//Hide pop-up
function hidePopup() {
  overlay.classList.remove('active');
  popUp.classList.remove('active');
}

//Set values to popup.
function setPopupValues(starsNumber, time) {
  popStars.innerHTML = "";
  addPopStars(starsNumber);
  popTime.innerHTML = time;
}

//Shuffle function on clicking 'refresh' button!
document.querySelector('.restart').addEventListener('click', function() {
  resetValues();
  replaceCards(cardsDeck);
});

//Reset game when click out of pop-up
overlay.addEventListener('click', function(){
  hidePopup();
  resetValues();
  replaceCards(cardsDeck);
});

//Reset game when clicking 'play again'
playAgain.addEventListener('click', function(){
  hidePopup();
  resetValues();
  replaceCards(cardsDeck);
});
