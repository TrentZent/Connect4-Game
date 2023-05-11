class Game {
  constructor(player1, player2, width = 7, height = 6) {
    this.width = width;
    this.height = height;
    this.currPlayer = player1;
    this.players = [player1, player2];
    this.board = [];
    this.gameOver = false;
  }

  restart() {
    // reset the board array
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }

    // set the current player to the first player
    this.currPlayer = this.players[0];

    // clear the game board in the user interface
    const cells = document.querySelectorAll("#board td");
    for (let cell of cells) {
      cell.innerHTML = "";
    }

    // reset the game over flag
    this.gameOver = false;
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }

  handleClick(evt) {
    if (this.gameOver) return;

    const x = +evt.target.id;

    const y = this.findSpotForCol(x);
    if (y === null) return;

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  checkForWin() {
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

const startBtn = document.querySelector("#start-game");
let game;

startBtn.addEventListener("click", () => {
  const player1Color = document.querySelector("#player1-color").value;
  const player2Color = document.querySelector("#player2-color").value;

  const player1 = new Player(player1Color);
  const player2 = new Player(player2Color);

  game = new Game(player1, player2);
  game.makeBoard();
  game.makeHtmlBoard();
});

const restartBtn = document.querySelector("#restart-game");
restartBtn.addEventListener("click", () => {
  if (game) {
    game.restart();
  }
});

const playerColorsForm = document.querySelector("#player-colors");
playerColorsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const player1Color = document.querySelector("#player1-color").value;
  const player2Color = document.querySelector("#player2-color").value;

  const player1 = new Player(player1Color);
  const player2 = new Player(player2Color);

  game = new Game(player1, player2);
  game.makeBoard();
  game.makeHtmlBoard();
});
