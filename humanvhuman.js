'use strict';
// TIMED TIC TAC TOE - FOR DUMMIES
// 3 BOARD TIC TAC TOE
// ways to trick - always start with any of the corners or center if AI starts first
class TicTacToe {
  constructor(curr_player, w, h) {

    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.player1 = 'X';
    this.player2 = 'O';
    this.res = [[0,0],[0,0]]; // store x1,y1,x2,y2 for first and last point for line
    this.player = curr_player;
    this.winner = null;
    this.end = "no";
  }

  // the methods
  // It draws the box
  initialise_board = (curr_sketch, w, h) => {
    curr_sketch.background('#363442');
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
        if (spot == "player1") {
          curr_sketch.noFill();
          curr_sketch.stroke('rgb(0,255,0)');
          curr_sketch.ellipse(x, y, r * 2);
        } else if (spot == "player2") {
          curr_sketch.stroke('red');
          curr_sketch.line(x - r, y - r, x + r, y + r);
          curr_sketch.line(x + r, y - r, x - r, y + r);
        }
      }
    }
  }
  isEmpty = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == "") return true;
      }
    }
    return false;
  }
  drawLine = (curr_sketch,w,h) => {
    curr_sketch.strokeWeight(20);
    curr_sketch.stroke('#83818FCF'); // RGBA 0-255
    curr_sketch.line(this.res[0][0]*w+w/2,this.res[0][1]*h+h/2,this.res[1][0]*w+w/2,this.res[1][1]*h+h/2);
    curr_sketch.noLoop();
  }

  mark_winner = (x1,y1,x2,y2) =>{
    this.res[0] = [x1,y1];
    this.res[1] = [x2,y2];
  }
  checkEnd = () => {
    //check horizontal winners
    let win = null;
  
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] != '' && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]) {
        win = this.board[i][0];
        this.mark_winner(i,0,i,2);
        return win;
      }
    }
    // check vertical winners
    for (let j = 0; j < 3; j++) {
      if (this.board[0][j] != '' && this.board[0][j] == this.board[1][j] && this.board[1][j] == this.board[2][j]) {
        win = this.board[0][j];
        this.mark_winner(0,j,2,j);
        return win;
      }
    }
    // check diagonal
    if (this.board[0][0] != '' && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
      win = this.board[0][0];
      this.mark_winner(0,0,2,2);
      return win;
    }
    // check other diagonal
    if (this.board[2][0] != '' && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) {
      win = this.board[2][0];
      this.mark_winner(2,0,0,2);
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
const make_board = (canvas_name,player) => {
  let w, h;
  var game = new TicTacToe(player, w, h);

  let board = (sketch) => {
    // SETUP 
    sketch.setup = () => {
      // create board
      sketch.createCanvas(400,400).parent(canvas_name); // height, width
      w = sketch.width / 3;
      h = sketch.height / 3;
    }
    // DRAW
    sketch.draw = () => {
      game.initialise_board(sketch, w, h); // find and fill board
      game.render_board(sketch, w, h);
      if (game.end=="yes") game.drawLine(sketch,w,h);
    }
    // MOUSE PRESS
    sketch.mousePressed = () => {
      if (game.end == "no") {
        //console.log("hi");
        let i = Math.floor(sketch.mouseX / w);
        let j = Math.floor(sketch.mouseY / h);
        //line(mouseX,mouseY,mouseX+100,mouseY+100);
        if (game.board[i][j] == "") {
          game.board[i][j] = game.player;
          //console.log("player1's turn");
          // check if player1 won
          let res = game.checkEnd();
          if (res != null) {
            game.winner = (res == "tie") ? "tie" : game.player;
            console.log("Winner is " + game.winner);
            game.end = "yes";
            sketch.noLoop();
            sketch.clear();
            // PRINT WINNER HERE 
            sketch.fill(50);
          }
          else { // next player
            game.player = (game.player=="player1") ? "player2" : "player1";
            //game.find_move();
          }
        }
      } // CLEAR BOARD AFTER GAME HAS ENDED
    }
  }
  return board;
}
new p5(make_board('can1',"player1")); 

//1,3,5,7,Infinity

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

consoleHello();