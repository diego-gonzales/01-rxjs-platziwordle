import { fromEvent, Subject } from 'rxjs';
import { map, filter, takeUntil } from "rxjs/operators";
import WORD_LIST from './wordList.json';

const lettersRows = document.querySelectorAll('.letter-row');
const messageText = document.getElementById('message-text');
const restartButton = document.querySelector('#restart-button');

const onKeyDown$ = fromEvent(document, 'keydown');

let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];

const getRandomWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
let rightWord = getRandomWord();
console.log(rightWord);

const userWinOrLose$ = new Subject();

// Insert a new letter
const insertLetter$ = onKeyDown$.pipe(
  map(event => event.key.toUpperCase()),
  filter(letter => letter.length === 1 && letter.match(/[a-z]/i) && letterIndex < 5),
);
const insertLetterObserver = {
  next: (value) => {
    let letterBox = Array.from(lettersRows)[letterRowIndex].children[letterIndex];
    letterBox.textContent = value;
    letterBox.classList.add('filled-letter');
    letterIndex++;
    userAnswer.push(value);
  }
};

// Check the word
const checkWord$ = onKeyDown$.pipe(
  map(event => event.key),
  filter(letter => letter === 'Enter' && letterIndex === 5 && letterRowIndex <= 5),
)
const checkWordObserver = {
  next: () => {
    if (userAnswer.length !== 5) {
      messageText.textContent = 'Please fill all the letters!';
      return;
    }

    for (let i = 0; i < 5; i++) {
      let letterColor = 'abc';
      let letterBox = Array.from(lettersRows)[letterRowIndex].children[i];
      let letterPosition = Array.from(rightWord).indexOf(userAnswer[i]);

      if (letterPosition === -1) {
        letterColor = 'letter-grey';
      } else {
        if (rightWord[i] !== userAnswer[i]) {
          letterColor = 'letter-yellow';
        } else {
          letterColor = 'letter-green';
        }
      }

      letterBox.classList.add(letterColor);
    }

    // if (userAnswer.length === 5) {
    //   letterIndex = 0;
    //   userAnswer = [];
    //   letterRowIndex++;
    // }

    if (userAnswer.join('') === rightWord) {
      messageText.textContent = 'You win! 😎😎😎';
      userWinOrLose$.next();
      restartButton.disabled = false;
    } else {
      letterIndex = 0;
      userAnswer = [];
      letterRowIndex++;

      if (letterRowIndex === 6) {
        messageText.textContent = 'You lose! 😭😭😭';
        userWinOrLose$.next();
        restartButton.disabled = false;
      }
    }
  }
};

// Remove a letter
const removeLetter$ = onKeyDown$.pipe(
  map((event) => event.key),
  filter((key) => key === "Backspace" && letterIndex !== 0)
);
const removeLetterObserver = {
  next: (value) => {
    let letterBox = Array.from(lettersRows)[letterRowIndex].children[letterIndex - 1];
    letterBox.textContent = '';
    letterBox.classList.remove('filled-letter');
    letterIndex--; 
    userAnswer.pop();
  }
};

// When user win or lose
userWinOrLose$.subscribe(() => {
  let letterRowsWinned = Array.from(lettersRows)[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    letterRowsWinned.children[i].classList.add('letter-green');
  }
})

// Subcribe to the observables
insertLetter$.pipe(takeUntil(userWinOrLose$)).subscribe(insertLetterObserver);
checkWord$.pipe(takeUntil(userWinOrLose$)).subscribe(checkWordObserver);
removeLetter$.pipe(takeUntil(userWinOrLose$)).subscribe(removeLetterObserver);
