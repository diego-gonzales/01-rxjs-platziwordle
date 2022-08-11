import { fromEvent, Subject, merge } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import WORD_LIST from './wordList.json';

const lettersRows = document.querySelectorAll('.letter-row');
const messageText = document.getElementById('message-text');
const restartButton = document.querySelector('#restart-button');

const onKeyDown$ = fromEvent(document, 'keydown');

let letterIndex;
let letterRowIndex;
let userAnswer;

const getRandomWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
let rightWord;

const userWinOrLose$ = new Subject();

// Insert a new letter
const insertLetter$ = onKeyDown$.pipe(
  map(event => event.key.toUpperCase()),
  filter(letter => letter.length === 1 && letter.match(/[a-z]/i) && letterIndex < 5),
);
const insertLetterObserver = {
  next: (value) => {
    messageText.textContent = '';
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
  filter(letter => letter === 'Enter' && letterRowIndex <= 5),
)
const checkWordObserver = {
  next: () => {
    if (userAnswer.length !== 5) {
      messageText.textContent = userAnswer.length === 4
        ? 'You are missing a letter'
        : `You are missing ${5 - userAnswer.length} letters`;
      return;
    }

    if (!WORD_LIST.includes(userAnswer.join(''))) {
      messageText.textContent = 'Wrong word';
      // return;
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
  filter((key) => key === 'Backspace' && letterIndex !== 0)
);
const removeLetterObserver = {
  next: () => {
    let letterBox = Array.from(lettersRows)[letterRowIndex].children[letterIndex - 1];
    letterBox.textContent = '';
    letterBox.classList.remove('filled-letter');
    letterIndex--; 
    userAnswer.pop();
  }
};

const onRestartClick$ = fromEvent(restartButton, 'click');
const onWindowLoad$ = fromEvent(window, 'load');
const restartGame$ = merge(onWindowLoad$, onRestartClick$);

restartGame$.subscribe(() => {
  Array.from(lettersRows).map((row) =>
    Array.from(row.children).map((letterBox) => {
      letterBox.textContent = '';
      letterBox.classList = 'letter';
    })
  );

  letterRowIndex = 0;
  letterIndex = 0;
  userAnswer = [];
  messageText.textContent = '';
  rightWord = getRandomWord();

  restartButton.disabled = true;

  console.log(`Right word: ${rightWord}`);

  let insertLetterSubscription = insertLetter$
    .pipe(takeUntil(userWinOrLose$))
    .subscribe(insertLetterObserver);
  let checkWordSubscription = checkWord$
    .pipe(takeUntil(userWinOrLose$))
    .subscribe(checkWordObserver);
  let removeLetterSubscription = removeLetter$
    .pipe(takeUntil(userWinOrLose$))
    .subscribe(removeLetterObserver);
});
