// Espera hasta que todo el contenido HTML se haya cargado y luego ejecuta el código
document.addEventListener("DOMContentLoaded", () => {
  // Código para los controles de música
  
  const playPauseBtn = document.getElementById('play-pause-btn');
  //  Botón de reproducción/pausa.
  const volumeControl = document.getElementById('volume-control');
  // Control deslizante para ajustar el volumen.
  const backgroundMusic = document.getElementById('background-music');
  //Elemento de audio que reproduce la música de fondo.

  // Reproduce o pausa la música
  playPauseBtn.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      playPauseBtn.textContent = '⏸️'; // Cambia el ícono a pausa
    } else {
      backgroundMusic.pause();
      playPauseBtn.textContent = '🎵'; // Cambia el ícono de nuevo a música
    }
  });

  // Control del volumen
  volumeControl.addEventListener('input', () => {
    backgroundMusic.volume = volumeControl.value;
  });

  // Iniciar música automáticamente con un volumen inicial del 50%
  backgroundMusic.volume = 1;
  backgroundMusic.play();


  // Control del volumen
  volumeControl.addEventListener('input', () => {
    backgroundMusic.volume = volumeControl.value;
    //Cambia el volumen de la música de fondo basándose en el valor del control deslizante 
  });

  // Iniciar música automáticamente
  backgroundMusic.volume = 1; // Volumen inicial al 50%

  // Código para el juego de memoria
  const images = [
    // Contiene la lista de rutas de imágenes que se usarán para las tarjetas.
    'img/imagen1.avif', 'img/imagen2.jpg', 'img/imagen3.png', 'img/imagen4.avif',
    'img/imagen5.avif', 'img/imagen6.jpg', 'img/imagen7.jpg', 'img/imagen8.png',
    'img/imagen9.webp', 'img/imagen10.webp', 'img/imagen11.png', 'img/imagen12.avif',
    'img/imagen13.jpg', 'img/imagen14.jpg', 'img/imagen15.jpg'
  ];

  let cardArray = [...images, ...images]; // Duplicamos las imágenes para tener 15 pares
  cardArray = shuffle(cardArray); // Mezclamos las cartas

  const gameBoard = document.getElementById('game-board'); //Referencia al tablero de juego.
  const statusMessage = document.getElementById('status-message');
   //Referencia al mensaje de estado donde se mostrarán mensajes como "Ganaste" o "Tiempo agotado".
  const resetButton = document.getElementById('reset-button');
  //  Referencia al botón para reiniciar el juego.
  const timerDisplay = document.createElement('div');
  // Crea un nuevo elemento div para mostrar el temporizador.
  timerDisplay.classList.add('timer');
  document.querySelector('.game-container').insertBefore(timerDisplay, gameBoard);

  let firstCard = null; //Almacenan las dos cartas seleccionadas.
  let secondCard = null;
  let lockBoard = false; //Bloquea el tablero mientras se revisan las cartas para evitar clics adicionales.
  let matches = 0;
  let timeLeft = 600; // 10 minutos en segundos
  let timerInterval;  // Controla el intervalo del temporizador.


  // Función para Voltear la Tarjeta
  function createBoard() {
    gameBoard.innerHTML = '';
    cardArray.forEach((imgSrc) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `<img src="${imgSrc}" alt="Herramienta">`;
      card.addEventListener('click', flipCard);
      gameBoard.appendChild(card);
    });
    startTimer();
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch(); // verifica si son lo mismo 
  }
  
  //  Verificar si hay un Par

  // Si son iguales, desactiva las cartas para que no se puedan volver a voltear (disableCards).
  // Si no coinciden, las vuelve a su estado original (unflipCards)
  function checkForMatch() {
    const isMatch = firstCard.innerHTML === secondCard.innerHTML;
    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
      showTemporaryMessage('¡Incorrecto! Intenta de nuevo.');
    }
  }


  // Desactivar las Cartas Emparejadas
  // Desactiva las cartas para que no puedan ser clicadas nuevamente cuando se forma un par.
  // Si se completan los 15 pares, detiene el temporizador y muestra un mensaje de victoria.
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matches++;
    if (matches === 15) {
      clearInterval(timerInterval);
      statusMessage.textContent = '¡Felicidades! Has ganado el juego.';
    }
  }

  // Desvoltear Cartas
  // Si las cartas no coinciden, las devuelve a su estado original después de 1 segundo para que el jugador las vea brevemente.
  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }

  // Resetear el Tablero
  // Restablece las variables firstCard y secondCard a null para permitir la selección de nuevas cartas.
  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function resetGame() {
    cardArray = shuffle([...images, ...images]);
    createBoard();
    matches = 0;
    statusMessage.textContent = '';
    timeLeft = 600; // Reiniciar el tiempo
    clearInterval(timerInterval); // Limpiar el temporizador previo
  }
  
  // Reiniciar el Juego
  //  Al hacer clic en el botón de reiniciar, se mezcla el tablero nuevamente, se reinicia el temporizador y las variables del juego.
  resetButton.addEventListener('click', resetGame);

  // Función para Mezclar el Arreglo
  // Mezcla aleatoriamente las tarjetas usando sort y Math.random().
  function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
  }

  // Temporizador de 10 minutos
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        statusMessage.textContent = '¡Se acabó el tiempo! Inténtalo de nuevo.';
        lockBoard = true; // Bloquea el tablero
      }
    }, 1000);
  }

  // Función para mostrar un mensaje temporalmente
  function showTemporaryMessage(message) {
    statusMessage.textContent = message;
    setTimeout(() => {
      statusMessage.textContent = ''; // Borra el mensaje después de 2 segundos
    }, 1000);
  }

  // Inicializar el tablero
  createBoard();
});

document.getElementById('exit-button').addEventListener('click', function() {
  // Cambia la URL de abajo por la pantalla principal o página de inicio deseada
  window.location.href = '/Plays/index.html'; // Redirige a la página principal
});
