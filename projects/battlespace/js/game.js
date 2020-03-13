'use strict';

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (() => {
        let fps = 60;
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 1000 / fps);
            };
    })();
}

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
    'img/boom.png'
];

const player_img = new Image();
player_img.src = images[0];

const enemy_img = new Image();
enemy_img.src = images[1];

const boom_img = new Image();
boom_img.src = images[2];

function startLoop() {
    isPlaying = true;
}

function stopLoop() {
    isPlaying = false;
}

function loadAudio(url, volume) {
    let audio = new Audio();
    audio.src = url;
    audio.volume = volume;
    return audio;
}

class Game {
    constructor() {
        this.canvas = document.getElementById("screen");
        this.screen = this.canvas.getContext('2d');
        this.gameSize = {
            x: this.canvas.width,
            y: this.canvas.height
        };
        this.bodies = createEnemy(this).concat([new Player(this, this.gameSize)]);
        let tick = () => {
            if (isPlaying) {
                this.update(this.gameSize);
                this.draw(this.screen, this.gameSize);
            }
            requestAnimationFrame(tick);
        }
        tick();
    }
    update() {
        let player;
        let bodies = this.bodies;
        let bodieslength = this.bodies.length;
        let notCollidingWithAnything = function(b1) {
            return bodies.filter(function(b2) {
                return colliding(b1, b2);
            }).length == 0;
        }
        this.bodies = this.bodies.filter(notCollidingWithAnything);
		document.getElementById('score').innerHTML = 'Score: ' + score;
        for (var i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i].position.y < 0 || this.bodies[i].position.y > 600) {
                this.bodies.splice(i, 1);
            }
            if (this.bodies[i] instanceof Player) {
                player = this.bodies[i];
            }
        }
        if (player == undefined) {
            setTimeout(function() {
                document.getElementById('modal-gameover').style.display = 'flex';
            }, 100)
            stopLoop();
        }
        if (bodieslength == 1) {
            document.getElementById('modal-gamewin').style.display = 'flex';
            stopLoop();
        }
        if (isPlaying) {
            if (player.position.x + player.size.width > this.gameSize.x) {
                player.position.x = this.gameSize.x - player.size.width;
            }
            if (player.position.x < 0) {
                player.position.x = this.gameSize.x / this.gameSize.x;
            }
        }
        for (i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
        }
    }
    draw(screen, gameSize) {
        clearCanvas(screen, gameSize);
        for (var i = 0; i < this.bodies.length; i++) {
            drawRect(this.screen, this.bodies[i]);
        }
    }
    addBody(body) {
        this.bodies.push(body);
    }
    enemyBelow(enemy) {
        return this.bodies.filter(function(b) {
            return b instanceof Enemy &&
                b.position.y > enemy.position.y &&
                b.position.x - enemy.position.x < enemy.size.width;
        }).length > 0;
    }
}

class Enemy {
    constructor(game, position) {
        this.game = game;
        this.size = {
            width: 28,
            height: 28
        }
        this.position = 0;
        this.position = position;
        this.patrolX = 0;
        this.speedX = 1;
    }
    update() {
        if (this.patrolX < 0 || this.patrolX > 150) {
            this.speedX = -this.speedX;
        }
        this.position.x += this.speedX;
        this.patrolX += this.speedX;
        if (Math.random() < 0.003 && !this.game.enemyBelow(this)) {
            let bullet = new Bullet({
                x: this.position.x + this.size.width / 2 - 3 / 2,
                y: this.position.y + this.size.height
            }, {
                x: Math.random() - 0.5,
                y: 8
            });
            this.game.addBody(bullet);
        }
    }
}
class Bullet {
	constructor(position, velocity) {
		this.size = {
			width: 3,
			height: 6
		}
		this.position = position;
		this.velocity = velocity;
	}
	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Player {
    constructor(game, gameSize) {
        this.game = game;
        this.bullets = 0;
        this.timer = 0;
        this.size = {
            width: 32,
            height: 32
        };
        this.position = {
            x: gameSize.x / 2 - this.size.width / 2,
            y: gameSize.y - this.size.height - 32
        }
        this.Keyboarder = new Keyboarder();
		var handleMotionEvent = (e) => {
			let interval = 0.5;
		    var x = e.accelerationIncludingGravity.x;
		    (x > -interval && x < interval) ? this.position.x = this.position.x : false;
		     x > interval ? this.position.x -= 4 : false;
		     x < -interval ? this.position.x += 4 : false;
		}
        this.handler = false;
        window.addEventListener('touchend', (e) => {
        	this.handler = true
        }, false);
		window.addEventListener("devicemotion", handleMotionEvent, true);

    }
    update() {
        if (this.Keyboarder.isDown(this.Keyboarder.KEYS.PAUSE)) {
            document.getElementById('pause').style.display = 'block';
            stopLoop();
        }
        if (this.Keyboarder.isDown(this.Keyboarder.KEYS.LEFT)) {
            this.position.x -= 4;
        }
        if (this.Keyboarder.isDown(this.Keyboarder.KEYS.RIGHT)) {
            this.position.x += 4;
        }
        if (this.Keyboarder.isDown(this.Keyboarder.KEYS.SPACE) || this.handler === true) {
            if (this.bullets < 1) {
                let bullet = new Bullet({
                    x: this.position.x + this.size.width / 2 - 3 / 2,
                    y: this.position.y - this.size.height / 2
                }, {
                    x: 0,
                    y: -8
                });
                this.game.addBody(bullet);
                this.bullets++;
                soundStack.snd1.load();
                setTimeout(() => {
                    soundStack.snd1.play();
                }, 50);
            }
            this.handler = false;
        }
        this.timer++;
        if (this.timer % 40 == 0) {
            this.bullets = 0;
        }
    }
}

class Keyboarder {
	constructor() {
	    let keyState = {};
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
}

var createEnemy = (game) => {
    let enemy = [];
    for (let i = 0; i < 24; i++) {
        let x = 20 + (i % 12) * 60;
        let y = 15 + (i % 8) * 15;
        enemy.push(new Enemy(game, {
            x: x,
            y: y
        }));
    }
    return enemy;
}

var colliding = (b1, b2) => {
    if (b1 != b2 && b1.position.x < b2.position.x + b2.size.width && b1.position.x + b1.size.width > b2.position.x &&
        b1.position.y < b2.position.y + b2.size.height && b1.position.y + b1.size.height > b2.position.y) {
        soundStack.snd2.load();
        setTimeout(() => {
            soundStack.snd2.play();
        }, 50);
        score += .5;
        boom = true;
        collElement = b2;
        return (b1, b2);
    }
}


var drawRect = (screen, body) => {
    if (body instanceof Player) {
        screen.drawImage(player_img, body.position.x, body.position.y, body.size.width, body.size.height);
    } else if (body instanceof Enemy) {
        screen.drawImage(enemy_img, body.position.x, body.position.y, body.size.width, body.size.height);
    } else {
        screen.fillStyle = 'rgb(255, 0, 0)';
        screen.fillRect(body.position.x, body.position.y, body.size.width, body.size.height);
    }
    if (boom) {
        screen.drawImage(boom_img, collElement.position.x, collElement.position.y, collElement.size.width + 10, collElement.size.height + 10);
        setTimeout(() => {
            boom = false;
        }, 40)
    }
}

var clearCanvas = (screen, gameSize) => {
    screen.clearRect(0, 0, gameSize.x, gameSize.y);
}

window.onload = () => {
    var game = new Game();
}		