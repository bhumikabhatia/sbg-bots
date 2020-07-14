'use strict';
// TASKS TO DO --------------------------------------------------
// PRINT WINNER
// FIX THE BUTTON 
// ALIGN CHOOSING OPTIONS ON THE LEFT SIDE OF CANVAS

// TIMED TIC TAC TOE - FOR DUMMIES
// 3 BOARD TIC TAC TOE
// ways to trick - always start with any of the corners or center if AI starts first
let first_move_ai = [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]];
class TicTacToe {
  constructor(max_depth, curr_player, w, h) {

    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

    this.ai = 'X';
    this.human = 'O';
    this.res = [[0, 0], [0, 0]]; // store x1,y1,x2,y2 for first and last point for line
    this.player = curr_player;
    this.curr_depth = 0; // start at 0 depth
    this.max_depth = max_depth;
    this.winner = null;
    this.end = "no"; // denotes if the game has ended
  }

  // the methods
  // It draws the box
  initialise_board = (curr_sketch, w, h) => {
    curr_sketch.background('rgba(54,52,66,0.05)');//'#363442'
    // curr_sketch.background('#36344202'); transparent ------------------------------------------------------
    curr_sketch.strokeWeight(4);
    curr_sketch.stroke('#E9E7F5CC');
    curr_sketch.line(w, 0, w, curr_sketch.height); // (x1,y1,x2,y2)
    curr_sketch.line(w * 2, 0, w * 2, curr_sketch.height);
    curr_sketch.line(0, h, curr_sketch.width, h);
    curr_sketch.line(0, h * 2, curr_sketch.width, h * 2);
    curr_sketch.line(w, 0, w, curr_sketch.height); // TRIAL
  }
  // adds O OR X 
  render_board = (curr_sketch, w, h) => {
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let x = w * i + w / 2;
        let y = h * j + h / 2;
        let spot = this.board[i][j];
        //console.log("I AM IN DARWWW");
        curr_sketch.textSize(32);

        let r = w / 2.8;
        if (spot == "human") {
          curr_sketch.noFill();
          curr_sketch.stroke('rgb(0,255,0)');
          curr_sketch.ellipse(x, y, r * 2);
        } else if (spot == "ai") {
          curr_sketch.stroke('red');
          curr_sketch.line(x - r, y - r, x + r, y + r);
          curr_sketch.line(x + r, y - r, x - r, y + r);
        }
      }
    }
  }
  print_winner = () => {
    if (this.winner!="tie")
      $("#winner").text ("Winner is "+this.winner+"!");
    else 
      $("#winner").text ("It's a "+this.winner+"!");
  }
  find_move = () => {
    // AI player - find move
    //console.log(this.winner);
    //if (this.winner!=null) return;
    let highest_score = -Infinity;
    //let bestdepth = -1;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // check if free
        if (this.board[i][j] == '') {
          this.board[i][j] = "ai"; // occupy it
          // now find score after making this move
          let scoree = this.minimax(this.curr_depth, "human");
          console.log(scoree);
          // undo move so that we can evaluate other moves
          this.board[i][j] = "";
          if (scoree > highest_score) {
            highest_score = Math.max(scoree, highest_score);
            console.log(i + " " + j);
            move = [i, j]; // current position that yields max score
          }
        }
      }
    }
    // decide move 
    let x, y;
    if (highest_score != -Infinity) {
      x = move[0];
      y = move[1];
      this.board[x][y] = "ai"; // check if move leads to winning
      this.curr_depth++;
      if (this.checkEnd() != null) {
        this.end = "yes";
        let y = this.checkEnd();
        this.winner = (this.checkEnd() == "tie") ? "tie" : "ai"; // log the winner 
        // PRINT WINNER HERE
        this.print_winner();
        console.log("Winner is " + this.winner);
      }
      else this.player = "human"; // next player's turn 
    }

  }
  minimax = (depth, player) => {
    // first check if board is full by this move or winner or max_depth reached
    let result = this.checkEnd();
    //console.log("The depth is " + depth);

    if (result != null || depth >= this.max_depth) {
      // we have a winner or draw
      //console.log("The winner is" + this.winner);
      if (result == "ai") return 100 - depth;
      else if (result == "human") return -100 + depth;
      else return 0; // tie
    }
    // maximising or minimizing 
    //console.log(depth,player,this.winner);
    let bestscore = player == "ai" ? -Infinity : Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // check if available
        if (this.board[i][j] == "") {
          // place
          this.board[i][j] = player; // AI or HUMAN depends 
          // recursive call
          let newplayer = (player == "ai") ? "human" : "ai";
          let score = this.minimax(depth + 1, newplayer); // increment depth
          //console.log(player,score);
          // backtrack
          this.board[i][j] = "";
          if (player == "ai") {
            bestscore = Math.max(score, bestscore);
          } else bestscore = Math.min(score, bestscore);
        }
      }
    }
    // console.log(player, bestscore);
    return bestscore;
  }
  isEmpty = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == "") return true;
      }
    }
    return false;
  }
  drawLine = (curr_sketch, w, h) => {
    curr_sketch.strokeWeight(20);
    curr_sketch.stroke('#83818FCF'); // RGBA 0-255
    curr_sketch.line(this.res[0][0] * w + w / 2, this.res[0][1] * h + h / 2, this.res[1][0] * w + w / 2, this.res[1][1] * h + h / 2);
    curr_sketch.noLoop();
  }

  mark_winner = (x1, y1, x2, y2) => {
    this.res[0] = [x1, y1];
    this.res[1] = [x2, y2];
  }
  checkEnd = () => {
    //check horizontal winners
    let win = null;

    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] != '' && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]) {
        win = this.board[i][0];
        this.mark_winner(i, 0, i, 2);
        return win;
      }
    }
    // check vertical winners
    for (let j = 0; j < 3; j++) {
      if (this.board[0][j] != '' && this.board[0][j] == this.board[1][j] && this.board[1][j] == this.board[2][j]) {
        win = this.board[0][j];
        this.mark_winner(0, j, 2, j);
        return win;
      }
    }
    // check diagonal
    if (this.board[0][0] != '' && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
      win = this.board[0][0];
      this.mark_winner(0, 0, 2, 2);
      return win;
    }
    // check other diagonal
    if (this.board[2][0] != '' && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) {
      win = this.board[2][0];
      this.mark_winner(2, 0, 0, 2);
      return win;
    }
    // before returning false, we must check if there is a tie
    // tie - 1. all spots occupied and no one is winner 
    if (!this.isEmpty()) {
      win = 'tie';
    }
    return win;
  }

};

// board for the game
const make_board = (canvas_name, player, max_depth) => {
  let w, h;
  if (max_depth == "Easy") max_depth = 1;
  else if (max_depth == "Medium") max_depth = 3;
  else if (max_depth == "Difficult") max_depth = 5;
  else if (max_depth == "Very Difficult") max_depth = 7;
  else max_depth = Infinity;
  var game = new TicTacToe(max_depth, player, w, h);

  let board = (sketch) => {
    // SETUP 
    sketch.setup = () => {
      // create board
      sketch.createCanvas(400, 400).parent(canvas_name); // height, width
      w = sketch.width / 3;
      h = sketch.height / 3;
      // first player is AI - choose between all corners and center
      if (game.player == 'ai') {
        let items = first_move_ai[Math.floor(Math.random() * first_move_ai.length)];
        game.board[items[0]][items[1]] = "ai";
        game.player = "human";
      }
    }
    // DRAW
    sketch.draw = () => {
      game.initialise_board(sketch, w, h); // find and fill board
      game.render_board(sketch, w, h);
      if (game.end == "yes" && game.winner != "tie") {
        game.drawLine(sketch, w, h);
      }
    }
    // MOUSE PRESS
    sketch.mousePressed = () => {
      if (game.player == "human" && game.end == "no") {
        //console.log("hi");
        let i = Math.floor(sketch.mouseX / w);
        let j = Math.floor(sketch.mouseY / h);
        //line(mouseX,mouseY,mouseX+100,mouseY+100);
        if (game.board[i][j] == "" && game.end == "no") {
          game.board[i][j] = "human";
          game.curr_depth++; // increment the depth
          console.log("human's turn");
          // check if human won
          let res = game.checkEnd();
          if (res != null) {
            game.winner = (res == "tie") ? "tie" : "human";
            game.end = "yes";
            //sketch.noLoop();
            console.log(game.end);
            sketch.clear();
            // PRINT WINNER HERE 
            game.print_winner();
          }
          else { // next player
            game.player = "ai";
            game.find_move();
          }
        }
      } // CLEAR BOARD AFTER GAME HAS ENDED
    }
  }
  return board;
}

let temp;
$(document).ready(function () {
  let level = 'Easy';
  let startingplayer = 'ai';
  temp = new p5(make_board('can1', startingplayer, level));
  consoleHello();

  $('#depth').on('change', function () {
    level = $('#depth').val();
  });

  $('#player').on('change', function () {
    startingplayer = $('#player').val();
  });

  $('#submit').click(function (event) {
    event.preventDefault(); // does not submit as default button does that
    temp.remove(); // Clears the p5 object

    console.log(startingplayer);
    console.log(level);

    $('#winner').html('&nbsp;');
    temp = new p5(make_board('can1', startingplayer, level));
  })
})


//new p5(make_board('can2'));
//new p5(make_board('can3'));
//new p5(make_board('can4'));

//1,3,5,7,Infinity
// This is to print SBG bots in console 
function consoleHello() {
  var userAgent = navigator.userAgent.toLowerCase();
  var supported = /(chrome|firefox)/;

  if (supported.test(userAgent.toLowerCase())) {
    var dark = ['padding: 18px 5px 16px', 'background-color: #171718', 'color: #e74c3c'].join(';');

    if (userAgent.indexOf('chrome') > -1) {
      dark += ';';
      dark += ['padding: 18px 5px 16px 40px', 'background-image: url(https://images-na.ssl-images-amazon.com/images/I/41sH7IIheaL._SY355_.png)', 'background-position: 10px 9px', 'background-repeat: no-repeat', 'background-size: 30px 30px'].join(';');
    }

    var red = ['padding: 18px 5px 16px', 'background-color: #e74c3c', 'color: #ffffff'].join(';');

    var spacer = ['background-color: transparent'].join(';');

    var msg = '%c Crafted with ❤ by SBG Bots %c https://github.com/bhumikabhatia/sbg-bots %c';

    console.log(msg, dark, red, spacer);
  } else if (window.console) console.log('Crafted with love by SBG Bots || https://github.com/bhumikabhatia/sbg-bots');
}