const $ = require('jquery');
var Skier = require('./skier');
var reportCollisions = require('./collision');
var obstacleGenerator = require('./obstacle-generator');
var yetiEnding = require('./yeti-ending');
var Yeti = require('./yeti');
var KeyEvents = require('./key-events');
var topScores = require('./top-scores');
var domManipulation = require('./dom-manipulation');

var canvas = document.getElementById('skifree');
var ctx = canvas.getContext('2d');
var stopped = false;
var scores = [];

var start = function(skier, yeti, obstacles, skierImg, obstaclesImg, increasedSpeed) {
  requestAnimationFrame(function gameLoop() {
    if (stopped === false) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      skier.draw(skierImg, skier);
      obstacleGenerator(obstacles, skier, canvas, ctx, obstaclesImg, increasedSpeed);
      reportCollisions(obstacles, skier);
      yetiEnding(skier, yeti, skierImg);
      stopper(skier, yeti);
      domManipulation.scoreBoard(skier);
      requestAnimationFrame(gameLoop);
    }
  });
};

function init() {
  document.addEventListener('keydown', function(event) {
    KeyEvents.keyPressed(event, skier);
  }, false);
  document.addEventListener('keyup', function(event) {
    KeyEvents.keyReleased(event, skier);
  }, false);
  var yeti = new Yeti({canvas: canvas, context: ctx });
  var skier = new Skier({ canvas: canvas, context: ctx });
  var obstacles = [];
  var skierImg = new Image();
  skierImg.src = 'images/sprites.png';
  var obstaclesImg = new Image();
  obstaclesImg.src = 'images/skifree-objects.png';
  var increasedSpeed = 0;
  start(skier, yeti, obstacles, skierImg, obstaclesImg, increasedSpeed);
  stopped = false;
  domManipulation.displayDivs('starter', 'none');
  domManipulation.displayDivs('game-over', 'none');
  domManipulation.displayDivs('score-board', 'inline');
}

function freshGame() {
  domManipulation.displayDivs('starter', 'inline');
  domManipulation.displayDivs('game-over', 'none');
  domManipulation.displayDivs('score-board', 'none');
  document.getElementById('start-button').onclick = function(){
    init();
  };
}

var stopper = function(skier, yeti) {
  if (Math.round(yeti.x) === Math.round(skier.x) && Math.round(yeti.y) === Math.round(skier.y)) {
    skier.lives = 0;
  }
  if (skier.lives <= 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stopped = true;
    topScores(skier, scores);
    gameOver(scores);
  }
};

function gameOver(scores) {
  domManipulation.displayDivs('game-over', 'inline');
  domManipulation.displayDivs('score-board', 'none');
  $('#top-scores').html("");
  for (var i = 0; i < scores.length; i++) {
    $('#top-scores').append(
      '<li>' + scores[i] + '</li>'
    );
  }
  document.getElementById('restart-button').onclick = function(){
    init();
  };
}

module.exports = { freshGame: freshGame };