'use strict';

var isPlaying;
var collElement;

var boom = false;
var score = 0;

var soundStack = {
	snd1 : loadAudio('sound/shoot.wav', 0.3),
	snd2 : loadAudio('sound/boom.mp3', 0.2)
};

const images = [ 
	'img/player.png', 
	'img/alien.png', 
	'img/boom.gif'
];
const player_img = new Image();
	player_img.src = images[0];

const enemy_img = new Image(); 
	enemy_img.src = images[1]; 

const boom_img = new Image();
	boom_img.src = images[2]; 

if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		let fps = 60;
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
		function(callback, element) {
			window.setTimeout( callback, 1000 / fps );
		};
	} )();
}

function startLoop() {
  isPlaying = true;
}

function stopLoop() {
  isPlaying = false;
}

var Game = function(canvasId) {
	var canvas = document.getElementById(canvasId);
	var screen = canvas.getContext('2d');
	var gameSize = {
		x: canvas.width,
		y: canvas.height
	};
	var self = this;
	this.bodies = createEnemy(this).concat([new Player(this, gameSize)]);
    var tick = function() {
   		requestAnimationFrame(tick);
    	if (isPlaying) {
    		self.update(gameSize);
    		self.draw(screen, gameSize);
           }
        }	
	tick();
};

Game.prototype = {
		update: function(gameSize) {
    		document.getElementById('score').innerHTML = 'Score: ' + score;
			var player;
			var bodies = this.bodies;
			var bodieslength = this.bodies.length;
			var notCollidingWithAnything = function(b1) {
				return bodies.filter(function(b2){
					return colliding(b1,b2);
				}).length == 0;
			}
			this.bodies = this.bodies.filter(notCollidingWithAnything);
			for(var i = 0; i < this.bodies.length; i++){
					if(this.bodies[i].position.y < 0 || this.bodies[i].position.y > 600){
						this.bodies.splice(i,1);
					}
					if(this.bodies[i] instanceof Player){
						player = this.bodies[i];
					}
			}
			if(player == undefined) {
				setTimeout(function(){ 
	        		document.getElementById('modal-gameover').style.display='flex';
				}, 100)
				stopLoop();
	      	}
			if(bodieslength == 1) {
		        document.getElementById('modal-gamewin').style.display='flex';
		        stopLoop(); 
			}
			if (isPlaying) {
				if(player.position.x + player.size.width > gameSize.x){
					player.position.x = gameSize.x - player.size.width;
				}
				if(player.position.x < 0) {
					player.position.x = gameSize.x / gameSize.x;
				}
			}
			for(i = 0; i < this.bodies.length; i++) {
				this.bodies[i].update();
			}	
		},
		draw: function(screen, gameSize) {
			clearCanvas(screen, gameSize);
			for(var i = 0; i < this.bodies.length; i++) {
				drawRect(screen, this.bodies[i]);
			}
		},
		addBody: function(body) {
			this.bodies.push(body);
		},
		enemyBelow: function(enemy) {
			return this.bodies.filter(function(b) {
				return b instanceof Enemy &&
				b.position.y > enemy.position.y &&
				b.position.x - enemy.position.x < enemy.size.width;
			}).length > 0;
		}
	}
	var Enemy = function(game, position) {
		this.game = game;
		this.size = {
			width: 28,
			height: 28
		};
		this.position = 0;
		this.position = position;
		this.patrolX = 0;
		this.speedX = 1;
	}
	Enemy.prototype = {
		update: function() {
			if(this.patrolX < 0 || this.patrolX > 150){
				this.speedX = -this.speedX;
			}
			this.position.x += this.speedX;
			this.patrolX += this.speedX;
			if(Math.random() < 0.003 && !this.game.enemyBelow(this)){
				var bullet = new Bullet(
				{
					x: this.position.x + this.size.width / 2 - 3/2,
					y: this.position.y + this.size.height
				},
					{
						x: Math.random()-0.5,
						y: 8
					});
				this.game.addBody(bullet);
			}
		}
	}
	var Player = function(game, gameSize){
		this.game = game;
		this.bullets = 0;
		this.timer = 0;
		this.size = {
			width: 32,
			height: 32
		};
		this.position = {
			x: gameSize.x/2-this.size.width/2,
			y: gameSize.y-this.size.height - 25
		}
		this.Keyboarder = new Keyboarder();
	}
	Player.prototype = {
		update: function() {
			if(this.Keyboarder.isDown(this.Keyboarder.KEYS.PAUSE)){
				document.getElementById('pause').style.display = 'block';
				stopLoop();
			}
			if(this.Keyboarder.isDown(this.Keyboarder.KEYS.LEFT)){
				this.position.x -= 4;
			}
			if(this.Keyboarder.isDown(this.Keyboarder.KEYS.RIGHT)){
				this.position.x += 4;
			}
			if(this.Keyboarder.isDown(this.Keyboarder.KEYS.SPACE)){
				if(this.bullets < 1) {
					var bullet = new Bullet(
						{
							x: this.position.x+this.size.width / 2 - 3/2,
							y: this.position.y-this.size.height / 2
						},
						{
							x: 0,
							y: -8
						});
					this.game.addBody(bullet);
					this.bullets++;
					soundStack.snd1.load();
					setTimeout(function() { soundStack.snd1.play(); }, 50);
				}
			}
			this.timer++;
			if(this.timer % 40 == 0){
				this.bullets = 0;
			}
		}
	}
	var Bullet = function(position, velocity){
		this.size = {
			width: 3,
			height: 6
		};
		this.position = position;
		this.velocity = velocity;
	}
	Bullet.prototype = {
		update: function() {
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		}
	}
	var Keyboarder = function() {
		var keyState = {};
		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		}
		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		}
		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		}
		this.KEYS = {
			LEFT: 37,
			RIGHT: 39,
			SPACE: 32,
			PAUSE: 13,
		};
	}
	var createEnemy = function(game) {
		var enemy = [];
		for(var i = 0; i < 24; i++){
			var x = 20 + (i%12) * 60;
			var y = 15 + (i%8) * 15;
			enemy.push(new Enemy(game, 
			{
				x: x, 
				y: y
			}));
		}
		return enemy;
	}
	function loadAudio(url, volume) {
		let audio = new Audio(); 
		audio.src = url; 
		audio.volume = volume;
		return audio;
	}
	var colliding = function(b1, b2) {
	  	if(b1 != b2 && b1.position.x < b2.position.x + b2.size.width  && b1.position.x + b1.size.width  > b2.position.x && 
	  	b1.position.y < b2.position.y + b2.size.height && b1.position.y + b1.size.height > b2.position.y) {
	  		soundStack.snd2.load();
	  		setTimeout(function() { soundStack.snd2.play(); }, 50);
	  		score += .5;
	  		boom = true;
	  		collElement = b2;
	  		return (b1, b2); 		
	  	}
	 }
	var drawRect = function(screen, body) {
			if(body instanceof Player){
				screen.drawImage(player_img, body.position.x, body.position.y, body.size.width, body.size.height);
			}else if(body instanceof Enemy){
				screen.drawImage(enemy_img, body.position.x, body.position.y, body.size.width, body.size.height);
			}else{
				screen.fillStyle = 'rgb(255, 0, 0)';
				screen.fillRect(body.position.x, body.position.y, body.size.width, body.size.height);
			}
			if (boom) {
				screen.drawImage(boom_img, collElement.position.x, collElement.position.y, collElement.size.width + 10, collElement.size.height + 10);
				setTimeout(function(){
					boom = false;
				}, 40)
			}
	}
	var clearCanvas = function(screen, gameSize){
		screen.clearRect(0, 0, gameSize.x, gameSize.y);
	}
	window.onload = function() {
		new Game('screen');
	}

