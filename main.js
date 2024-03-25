'use strict';

const container = document.querySelector('.container');
let interval;

// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция:
// [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]. count - количество пар.

function createNumbersArray(count) {
  let arrPairedNumbers = [];
  for (let i = 1; i <= count * count / 2; i++) {
    arrPairedNumbers.push(i, i);
  }
  return arrPairedNumbers;
}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает
// перемешанный массив. array - массив чисел

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Этап 3. Используйте две созданные функции для создания массива с перемешанными номерами. На основе этого массива вы
// можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также
// можете создать для этого специальную функцию. count - количество пар.

function startGame(count) {
  const listItems = document.createElement('ul');
  const restartButton = document.createElement('button');
  const timer = document.createElement('div');

  const cards = [];       // массив карточек
  let flippedCards = [];  // массив для перевёрнутых карточек двух (для сравнения) (обнуляется)

  const shuffledNumbers = shuffle(createNumbersArray(count));

  timer.textContent = '00:01:00';
  restartButton.textContent = 'Начать заново';

  timer.classList.add('mb-3');
  listItems.classList.add('row', 'g-2', 'list-unstyled', 'justify-content-center');
  restartButton.classList.add('btn', 'btn-secondary');

  switch (count) {
    case 2:
      // listItems.classList.add('row-cols-2');
      container.style.maxWidth = '250px';
      break;
    case 4:
      // listItems.classList.add('row-cols-4');
      container.style.maxWidth = '500px';
      break;
    case 6:
      // listItems.classList.add('row-cols-6');
      container.style.maxWidth = '700px';
      break;
    case 8:
      // listItems.classList.add('row-cols-8');
      container.style.maxWidth = '900px';
      break;
    case 10:
      listItems.classList.add('row-cols-2');
      container.style.maxWidth = '250px';
      break;
    case 4:
      listItems.classList.add('row-cols-4');
      container.style.maxWidth = '500px';
      break;
    case 6:
      listItems.classList.add('row-cols-6');
      container.style.maxWidth = '700px';
      break;
    case 8:
      listItems.classList.add('row-cols-8');
      container.style.maxWidth = '900px';
      break;
    case 10:
      listItems.classList.add('row-cols-10');
      container.style.maxWidth = '1100px';
      break;
  }

  container.append(timer);
  container.append(listItems);
  container.append(restartButton);

  for (const number of shuffledNumbers) {
    const li = document.createElement('li');
    const card = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');

    li.classList.add('col', 'scene');
    card.classList.add('card', 'p-5');
    cardFront.classList.add('card__face', 'card__face--front');
    cardBack.classList.add('card__face', 'card__face--back');

    cardBack.textContent = number;

    card.append(cardFront, cardBack);
    li.append(card);
    listItems.append(li);

    cards.push(card);

    card.addEventListener('click', () => flipCard(card, number));
    restartButton.addEventListener('click', () => newGame(count, cards));
  }

  function flipCard(card, number) {
    if (card.classList.contains('is-flipped') || flippedCards.length === 2) {
      return; // выходим и не выполняем дальнейшие действия
    } else {
      card.classList.add('is-flipped');
      flippedCards.push({card, number});
    }

    if (flippedCards.length === 2) {            // проверка на совпадение значений карточек
      const firstCard = flippedCards[0].number;
      const secondCard = flippedCards[1].number;

      if (firstCard === secondCard) {
        flippedCards = [];
      } else {
        setTimeout(() => {
          flippedCards.forEach(({card}) => {        // используем деструктуризацию для извлечения card из объекта
            card.classList.remove('is-flipped');   // если делать через просто item, то надо использовать item.card
          });
          flippedCards = [];
        }, 1000);
      }
    }
    // если все карточки открыты, то игра окончена
    if (cards.every((item) => item.classList.contains('is-flipped'))) {
      setTimeout(() => {
        gameOver(timer);
      }, 1000);
    }
  }

  StartTimer(timer);
}

function StartTimer(timer) {
  let seconds = 60;

  interval = setInterval(() => {
    seconds > 0 ? seconds-- : clearInterval(interval);
    timer.textContent = `00:00:${seconds.toString().padStart(2, '0')}`; // добавляем 0 в начале, если длина строки < 2

    if (timer.textContent === '00:00:00') {
      gameOver(timer);
    }
  }, 1000);
}

function newGame(count, cards) {
  cards.forEach((item) => {
    item.classList.remove('is-flipped');
  });

  setTimeout(() => {  // ожидание переворота карточек и перезапуск игры
    container.innerHTML = '';
    startGame(count);
  }, 800);
}

function gameOver(timer) {
  const div = document.createElement('div');
  const newGameButton = document.createElement('button');

  clearInterval(interval); // останавливаем таймер, чтобы он не шёл, когда карты все открыты

  const timeLeft = timer.textContent.split(':').at(-1);   // разбираем строку и забираем последний элемент после :

  if (timer.textContent === '00:00:00') {
    div.textContent = 'Игра окончена, время вышло!';
  } else {
    div.textContent = `Игра окончена! Вы закончили игру за ${60 - timeLeft} секунд!`;
  }

  newGameButton.textContent = 'Сыграть ещё';

  div.classList.add('mb-3');
  newGameButton.classList.add('btn', 'btn-primary');

  container.innerHTML = '';

  container.append(div);
  container.append(newGameButton);

  newGameButton.addEventListener('click', () => {
    container.innerHTML = '';
    container.style.maxWidth = '';
    PlayingField();
  });
}

// Выбор игрового поля перед стартом игры
function PlayingField(count) {
  const form = document.createElement('form');
  const label = document.createElement('label');
  const input = document.createElement('input');
  const description = document.createElement('div');
  const button = document.createElement('button');

  form.classList.add('form');
  label.classList.add('form-label');
  label.textContent = 'Количество карточек по вертикали/горизонтали:';
  label.for = 'inputId';
  input.id = 'inputId';
  input.classList.add('form-control');
  input.placeholder = '4';
  description.classList.add('form-text', 'mb-3');
  description.textContent = 'В поле можно ввести чётное число от 2 до 10';
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Начать игру';

  container.append(form);
  form.append(label);
  label.append(input);
  form.append(description);
  form.append(button);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    checkInputValue();
  });

  function checkInputValue() {
    count = Number(input.value);

    if (count < 2 || count > 10 || count % 2 !== 0) {
      count = '4';
    }
    form.remove();
    startGame(count);
  }
}

PlayingField();
