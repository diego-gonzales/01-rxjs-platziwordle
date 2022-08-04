import { fromEvent, Subject } from 'rxjs';
import WORD_LIST from './wordList.json';

const lettersRows = document.querySelectorAll('.letter-row');
const messageText = document.getElementById('message-text');

const onKeyDown$ = fromEvent(document, 'keydown');
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];

const getRandomWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
let rightWord = getRandomWord();
console.log(rightWord);

const userWinOrLose$ = new Subject();

const insertLetterObserver = {
  next: (value) => {
    const pressedKey = value.key.toUpperCase();

    if (userAnswer.length === 5) return;

    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
      messageText.textContent = '';

      let letterBox = Array.from(lettersRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add('filled-letter');
      userAnswer.push(pressedKey);
      letterIndex++;
    }
  }
};

const deleteLetterObserver = {
  next: (value) => {
    const pressedKey = value.key;

    if (pressedKey === 'Backspace' && letterIndex !== 0) {
      messageText.textContent = '';

      let letterBox = Array.from(lettersRows)[letterRowIndex].children[letterIndex - 1];
      letterBox.textContent = '';
      letterBox.classList.remove('filled-letter');
      letterIndex--; 
      userAnswer.pop();
    }
  }
};

const checkWordObserver = {
  next: (value) => {
    if (value.key === 'Enter') {

      if (userAnswer.length !== 5) {
        messageText.textContent = 'Please fill all the letters';
        return;
      }

      for (let i = 0; i < 5; i++) {
        let letterColor = 'same-color';
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
      }

      if (userAnswer.length === 5) {
        letterIndex = 0;
        userAnswer = [];
        letterRowIndex++;
      }
    }
  }
};

onKeyDown$.subscribe(insertLetterObserver);
onKeyDown$.subscribe(checkWordObserver);
onKeyDown$.subscribe(deleteLetterObserver);
userWinOrLose$.subscribe(() => {
  let letterRowsWinned = Array.from(lettersRows)[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    letterRowsWinned.children[i].classList.add('letter-green');
  }
})