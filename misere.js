'use strict';
// AIM OF GAME IS TO LOSE! DO NOT MAKE 3 
let first_move_ai = [[0, 0], [0, 2],[1, 0],[1,2],[2, 1],[2, 0], [2, 2]]; // anything but center 
class TicTacToe {
  constructor(max_depth, curr_player, w, h,helper) {

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
    this.helper = helper=="true" ? true : false; // default
    this.nexthumanmove = [];
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
        curr_sketch.textSize(32);

        let r = w / 2.8;
        if (spot == "human") {
            curr_sketch.stroke('red');
            curr_sketch.line(x - r, y - r, x + r, y + r);
            curr_sketch.line(x + r, y - r, x - r, y + r);
        } else if (spot == "ai") {
          //curr_sketch.delay(1);
          curr_sketch.stroke('red');
          curr_sketch.line(x - r, y - r, x + r, y + r);
          curr_sketch.line(x + r, y - r, x - r, y + r);
        }
      }
    }
  }
  // draws the hint box
  highlight_hint = (curr_sketch,w,h) => {
    if (this.player=="human" && this.end=="no" && this.helper==true){ // ADD THE BUTTON CLICK CONDITION HERE SO THIS FUNCTION IS ONLY ACTIVATED THEN
    this.human_move_help();
    // now highlight hint placed in this.humannextmove
    let x = this.nexthumanmove[0]*w;
    let y = this.nexthumanmove[1]*h;
    curr_sketch.stroke('white');
    curr_sketch.fill(255,20);
    curr_sketch.rect(x,y,w,h);
    }
  }
  print_winner = () => {
    if (this.winner!="tie")
      $("#winner").text ("Winner is "+this.winner+"!");
    else 
      $("#winner").text ("It's a "+this.winner+"!");
    $("#curr-player").text("GAME END");
  }
  human_move_help = () =>{
    if (this.helper==true && this.player=="human" && this.end=="no"){
      // edge case - first move human
      let res = this.find_move();
      this.nexthumanmove = res;
    }
    return;
  }
  find_move = () => {
    let bestscore = this.player == "human" ? -Infinity : Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // check if free
        if (this.board[i][j] == '') {
          this.board[i][j] = this.player; // occupy it
          // now find score after making this move
          let newplayer = (this.player=="ai") ? "human" : "ai";
          let score = this.minimax(this.curr_depth,newplayer,-Infinity,Infinity); // pass alpha and beta
          console.log(score);
          // undo move so that we can evaluate other moves
          this.board[i][j] = '';
          if (this.player == "ai" && score<bestscore) {
            bestscore = Math.min(score, bestscore);
            console.log(i + " " + j);
            move = [i, j]; // current position that yields max score
          } else if (this.player=="human" && score>bestscore){
            bestscore = Math.max(score, bestscore);
            move = [i,j];
          } 
          
        }
      }
    }
    // decide move 
    let x, y;
    if (this.player!="ai"){
      // return best move possible
      return move;
    }
    if (bestscore != Infinity) {
      // if it is AI's first move when human has already played
      x = move[0];
      y = move[1];
      this.board[x][y] = "ai"; // check if move leads to winning
      this.curr_depth++;
      if (this.checkEnd(this.player) != null) {
        this.end = "yes";
        this.winner = (this.checkEnd(this.player) == "tie") ? "tie" : "human"; // log the winner 
        // PRINT WINNER HERE
        this.print_winner();
        console.log("Winner is " + this.winner);
      }
      else this.player = "human"; // next player's turn 
    }

  }
  minimax = (depth, player,alpha,beta) => {
    // first check if board is full by this move or winner or max_depth reached
    let result = this.checkEnd(player);
    //console.log("The depth is " + depth);

    if (result != null || (depth >= this.max_depth && this.player=="ai")) {
      // we have a winner or draw
      //console.log("The winner is" + this.winner);
      if (result == "ai") return -100 + depth;
      else if (result == "human") return 100 - depth;
      else return 0; // tie
    }
    // maximising or minimizing 
    //console.log(depth,player,this.winner);
    let bestscore = player == "human" ? -Infinity : Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // check if available
        if (this.board[i][j] == "") {
          // place
          this.board[i][j] = player; // AI or HUMAN depends 
          // recursive call
          let newplayer = (player == "ai") ? "human" : "ai";
          let score = this.minimax(depth + 1, newplayer,alpha,beta); // increment depth
          //console.log(player,score);
          // backtrack
          this.board[i][j] = "";
          if (player == "human") {
            bestscore = Math.max(score, bestscore);
            //alpha = Math.max(alpha,score);
          } 
          else {
            bestscore = Math.min(score, bestscore);
            //beta = Math.min(beta,score);
          }
          //if (beta<=alpha) break; // pruning the current tree state as it won't affect the outcome
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
  checkEnd = (player) => {
    //check horizontal winners
    let win = null;
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] != '' && this.board[i][1] != '' && this.board[i][2] != '') {
        win = player;
        this.mark_winner(i, 0, i, 2);
        return win;
      }
    }
    // check vertical winners
    for (let j = 0; j < 3; j++) {
      if (this.board[0][j] != '' && this.board[1][j] != '' && this.board[2][j] != '') {
        win = player;
        this.mark_winner(0, j, 2, j);
        return win;
      }
    }
    // check diagonal
    if (this.board[0][0] != '' && this.board[1][1] != '' && this.board[2][2] != '') {
        win = player;
      this.mark_winner(0, 0, 2, 2);
      return win;
    }
    // check other diagonal
    if (this.board[2][0] != '' && this.board[1][1]!= '' && this.board[0][2]!= '') {
        win = player;
      this.mark_winner(2, 0, 0, 2);
      return win;
    }
    // before returning false, we must check if there is a tie
    // tie - 1. all spots occupied and no one is winner 
    //if (!this.isEmpty()) {
    //  win = 'tie';
    //}
    return win;
  }

};
// board for the game
const make_board = (canvas_name, player, max_depth,helper) => {
  let w, h;
  if (max_depth == "Easy") max_depth = 1;
  else if (max_depth == "Medium") max_depth = 3;
  else if (max_depth == "Difficult") max_depth = 5;
  else if (max_depth == "Very Difficult") max_depth = 7;
  else max_depth = Infinity;
  var game = new TicTacToe(max_depth, player, w, h,helper);

  let board = (sketch) => {
    // SETUP 
    sketch.setup = () => {
      // create board
      sketch.createCanvas(400, 400).parent(canvas_name); // height, width
      w = sketch.width / 3;
      h = sketch.height / 3;
      // first player is AI - choose between all corners and center
      if (game.player=="ai" && max_depth==Infinity){
        game.find_move();
      }
      else if (game.player=="ai"){
        let items = first_move_ai[Math.floor(Math.random() * first_move_ai.length)];
        game.board[items[0]][items[1]] = "ai";
        game.player = "human";
      }
    }
    // DRAW
    sketch.draw = () => {
      game.initialise_board(sketch, w, h); // find and fill board
      game.render_board(sketch, w, h);
      game.highlight_hint(sketch,w,h);
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
        game.human_move_help();
        if (game.board[i][j] == "" && game.end == "no") {
          game.board[i][j] = "human";
          game.curr_depth++; // increment the depth
          // check if human won
          let res = game.checkEnd(game.player);
          if (res != null) {
            game.winner = (res == "tie") ? "tie" : "ai";
            game.end = "yes";
            sketch.noLoop();
            //sketch.clear();
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
  let level = "Medium";
  let startingplayer = "ai";
  let helper = false; // default
  temp = new p5(make_board('can1', startingplayer, level,helper));
  //temp2 = new p5(make_board('can2', startingplayer, level,helper));
  //temp3 = new p5(make_board('can3', startingplayer, level,helper));
  consoleHello();

  $('#depth').on('change', function () {
    level = $('#depth').val();
  });

  $('#player').on('change', function () {
    startingplayer = $('#player').val();
  });

  $('#helper').on('change', function () {
    helper = $('#helper').val();
  });

  $('#submit').click(function (event) {
    event.preventDefault(); // does not submit as default button does that
    temp.remove(); // Clears the p5 object

    console.log(startingplayer);
    console.log(level);
    console.log(helper);
    $('#winner').html('&nbsp;');
    temp = new p5(make_board('can1', startingplayer, level,helper));
    //temp2 = new p5(make_board('can2', startingplayer, level,helper));
    //temp3 = new p5(make_board('can3', startingplayer, level,helper));
  })
})

//1,3,5,7,Infinity
// This is to print SBG bots in console 
function consoleHello() {
  var userAgent = navigator.userAgent.toLowerCase();
  var supported = /(chrome|firefox)/;

  if (supported.test(userAgent.toLowerCase())) {
    var dark = ['padding: 18px 5px 16px', 'background-color: #171718', 'color: #e74c3c'].join(';');

    if (userAgent.indexOf('chrome') > -1) {
      dark += ';';
      dark += ['padding: 18px 5px 16px 40px', 'background-image: url("https://i.imgur.com/ElEn6VW.png")', 'background-position: 10px 9px', 'background-repeat: no-repeat', 'background-size: 30px 30px'].join(';');
    }

    var red = ['padding: 18px 5px 16px', 'background-color: #e74c3c', 'color: #ffffff'].join(';');

    var spacer = ['background-color: transparent'].join(';');

    var msg = '%c Crafted with ❤ by SBG Bots %c https://github.com/bhumikabhatia/sbg-bots %c';

    console.log(msg, dark, red, spacer);
  } else if (window.console) console.log('Crafted with love by SBG Bots || https://github.com/bhumikabhatia/sbg-bots');
}