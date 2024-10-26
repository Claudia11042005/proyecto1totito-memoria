const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('status-message');
const restartButton = document.getElementById('restartButton');
let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;
let timerInterval; // Para controlar el intervalo del cronómetro
let timeElapsed = 0;
let timerStarted = false; // Verifica si el cronómetro ha iniciado

// Contadores de victorias y empates
let xWins = 0;
let oWins = 0;
let draws = 0;

// Crear elementos para mostrar los contadores sin modificar el DOM principal
const scoreboard = document.createElement('div');
scoreboard.innerHTML = `
  
`;

// Añadir el marcador al final del body sin sobrescribir los elementos
document.body.appendChild(scoreboard);

// Combinaciones ganadoras
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    document.getElementById('timer').textContent = 'Tiempo: ${timeElapsed} segundos';
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timeElapsed = 0;
  document.getElementById('timer').textContent = 'Tiempo: 0 segundos';
  timerStarted = false;
}

function handleClick(e) {
  const cell = e.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  if (board[cellIndex] !== null || !gameActive) {
    return;
  }

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  board[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    statusMessage.textContent = '¡Jugador ${currentPlayer} ha ganado!';

    // Incrementar el contador de victorias
    if (currentPlayer === 'X') {
      xWins++;
      document.getElementById('x-wins').textContent = ` ${xWins}`;
    } else {
      oWins++;
      document.getElementById('o-wins').textContent = ` ${oWins}`;
    }

    gameActive = false;
    stopTimer();
  } else if (board.every(cell => cell !== null)) {
    statusMessage.textContent = '';
    
    // Incrementar el contador de empates
    draws++;
    document.getElementById('draws').textContent = 'Empates: ${draws}';

    gameActive = false;
    stopTimer();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.textContent = 'Turno del Jugador ${currentPlayer}';
  }
}

function checkWin(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

function restartGame() {
  board.fill(null);
  gameActive = true;
  currentPlayer = 'X';
  statusMessage.textContent = 'Turno del Jugador ${currentPlayer}';
  cells.forEach(cell => (cell.textContent = ''));
  resetTimer(); // Reinicia el cronómetro al reiniciar el juego
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
statusMessage.textContent = 'Turno del Jugador ${currentPlayer}';

function initializeMusicControls() {
  const playPauseBtn = document.getElementById('play-pause-btn');
  const volumeControl = document.getElementById('volume-control');
  const backgroundMusic = document.getElementById('background-music');

  // Reproduce o pausa la música
  playPauseBtn.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      playPauseBtn.textContent = '⏸'; // Cambia el ícono a pausa
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
  backgroundMusic.volume = 0.5;
  backgroundMusic.play();
}

// Llamar a la función cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  initializeMusicControls();
});

document.getElementById('exit-button').addEventListener('click', function() {
  // Cambia la URL de abajo por la pantalla principal o página de inicio deseada
  window.location.href = '/Plays/index.html'; // Redirige a la página principal
});