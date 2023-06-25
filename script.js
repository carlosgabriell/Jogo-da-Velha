document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("player-names");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const resetButton = document.getElementById("reset-button");
  const board = document.getElementById("board").children;
  const status = document.getElementById("status");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-player");

  let players = {}; // Objeto para armazenar os dados dos jogadores
  let currentPlayer = "X";
  let currentPlayerName = "";
  let moves = 0;
  let gameActive = false;
  let winner = null;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const player1 = player1Input.value;
    const player2 = player2Input.value;

    if (player1 && player2) {
      currentPlayerName = player1;
      player1Input.value = "";
      player2Input.value = "";
      form.style.display = "none";
      gameActive = true;
      status.innerHTML = "É a vez de " + currentPlayerName + " (X)";

      // Iniciar o jogo
      for (let i = 0; i < board.length; i++) {
        board[i].addEventListener("click", cellClick, false);
      }
      resetButton.addEventListener("click", resetGame, false);
    } else {
      alert("Por favor, insira os nomes de ambos os jogadores.");
    }
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchPlayer = searchInput.value;
    if (searchPlayer) {
      displayPlayerStats(searchPlayer);
      searchInput.value = "";
    }
  });

  function cellClick() {
    if (!gameActive || this.innerHTML !== "") {
      return;
    }

    this.innerHTML = currentPlayer;
    moves++;
    checkWin();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.innerHTML =
      "É a vez de " +
      (currentPlayer === "X" ? player1Input.value : player2Input.value) +
      " (" +
      currentPlayer +
      ")";
  }

  function checkWin() {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Linhas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Colunas
      [0, 4, 8],
      [2, 4, 6], // Diagonais
    ];

    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        board[a].innerHTML !== "" &&
        board[a].innerHTML === board[b].innerHTML &&
        board[a].innerHTML === board[c].innerHTML
      ) {
        gameActive = false;
        winner = currentPlayer;
        status.innerHTML =
          "O jogador " +
          (currentPlayer === "X" ? player1Input.value : player2Input.value) +
          " (" +
          currentPlayer +
          ") venceu!";
        updateStats(currentPlayer);
        break;
      }
    }

    if (moves === 9 && winner === null) {
      gameActive = false;
      status.innerHTML = "O jogo empatou!";
      updateStats(null);
    }
  }

  function resetGame() {
    currentPlayer = "X";
    currentPlayerName = "";
    moves = 0;
    gameActive = false;
    winner = null;
    status.innerHTML = "";
    form.style.display = "block";
    resetBoard();
  }

  function resetBoard() {
    for (let i = 0; i < board.length; i++) {
      board[i].innerHTML = "";
    }
  }

  function updateStats(winner) {
    const now = new Date();
    const currentTime = now.toLocaleString();

    if (players.hasOwnProperty(currentPlayerName)) {
      players[currentPlayerName].push(currentTime);
    } else {
      players[currentPlayerName] = [currentTime];
    }

    console.log("Jogador: " + currentPlayerName);
    console.log("Horários de jogo: " + players[currentPlayerName].join(", "));
    console.log("Vencedor: " + (winner ? currentPlayerName : "Empate"));
  }

  function displayPlayerStats(playerName) {
    if (players.hasOwnProperty(playerName)) {
      const gamesPlayed = players[playerName].length;
      const wins = countWins(playerName);
      const losses = gamesPlayed - wins;
      const averageInterval = calculateAverageInterval(playerName);

      console.log("Estatísticas do jogador: " + playerName);
      console.log("Partidas jogadas: " + gamesPlayed);
      console.log("Vitórias: " + wins);
      console.log("Derrotas: " + losses);
      console.log(
        "Intervalo médio entre partidas: " + averageInterval + " horas"
      );
    } else {
      console.log("Jogador não encontrado.");
    }
  }

  function countWins(playerName) {
    let wins = 0;

    for (let i = 0; i < players[playerName].length; i++) {
      if (i === 0) {
        wins++;
      } else {
        const previousTime = new Date(players[playerName][i - 1]);
        const currentTime = new Date(players[playerName][i]);

        if (currentTime.getTime() - previousTime.getTime() > 0) {
          wins++;
        }
      }
    }

    return wins;
  }

  function calculateAverageInterval(playerName) {
    let totalInterval = 0;

    for (let i = 0; i < players[playerName].length - 1; i++) {
      const startTime = new Date(players[playerName][i]);
      const endTime = new Date(players[playerName][i + 1]);
      const interval = endTime.getTime() - startTime.getTime();
      totalInterval += interval;
    }

    const averageInterval = totalInterval / (players[playerName].length - 1);
    return (averageInterval / (1000 * 60 * 60)).toFixed(2); // Converter para horas
  }
});
