function Pong() {
    "use strict"
    var version = 'v0.0.2';

    var WIDTH = 800, HEIGHT = 600, PI = Math.PI;
    var upArrow = 38, downArrow = 40;
    var canvas, context, keystate;
    var player, ai, ball;

    var bgImageReady = false;
    var bgImageSrc = 'img/background.png';
    var bgImage;

    player = {
        x: null,
        y: null,
        width: 20,
        height: 100,

        imageReady: false,
        imageSrc: 'img/paddle.png',
        image: null,

        update: function() {
            if (keystate[upArrow])
                this.y -= 7;
            if (keystate[downArrow])
                this.y += 7;

            this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
        },

        draw: function() {
            if (this.imageReady) {
                context.drawImage(this.image, this.x, this.y);
            }
        }
    }

    ai = {
        x: null,
        y: null,
        width: 20,
        height: 100,

        imageReady: false,
        imageSrc: 'img/paddle.png',
        image: null,

        update: function() {
            var dest_y = ball.y - (this.height + ball.side) * 0.5;
            this.y += (dest_y - this.y) * 0.1;

            this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
        },

        draw: function() {
            if (this.imageReady) {
                context.drawImage(this.image, this.x, this.y);
            }
        }
    }

    ball = {
        x: null,
        y: null,
        side: 20,
        speed: 5,
        velocity: null,

        imageReady: false,
        imageSrc: 'img/ball.png',
        image: null,

        serve: function(side) {
            var r = Math.random();
            this.x = side === 1 ? player.x + player.width: ai.x - this.side;
            this.y = (HEIGHT - this.side) * r;

            var phi = 0.1 * PI * (1 - 2 * r);
            this.velocity = {
                x: side * this.speed * Math.cos(phi),
                y: this.speed * Math.sin(phi)
            }
        },

        update: function() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (this.y < 0 || this.y + this.side > HEIGHT) {
                var offset = this.velocity.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.side);

                this.y += 2 * offset;
                this.velocity.y *= -1;
            }

            var intersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
                var result =
                    ax < bx + bw &&
                    ay < by + bh &&
                    bx < ax + aw &&
                    by < ay + ah;
                return result;
            }

            var paddle = this.velocity.x < 0 ? player : ai;

            if (intersect(paddle.x, paddle.y, paddle.width, paddle.height, this.x, this.y, this.side, this.side)) {
                this.x = paddle === player ? player.x + player.width : ai.x - this.side;
                var n = (this.y + this.side - paddle.y) / (paddle.height + this.side); //Normalized value for location on the paddle where the ball hits
                var phi = (PI / 4) * (2 * n - 1);

                var smash = Math.abs(phi) > 0.2 * PI ? 1.5 : 1;
                this.velocity.x = smash * (paddle === player ? 1 : -1) * this.speed * Math.cos(phi);
                this.velocity.y = smash * this.speed * Math.sin(phi);
            }

            if (this.x + this.side < 0 || this.x > WIDTH) {
                this.serve(paddle === player ? 1 : -1);
            }
        },

        draw: function() {
            if (this.imageReady) {
                context.drawImage(this.image, this.x, this.y);
            }
        }
    }

    function init() {
        bgImage = new Image();
        bgImage.onload = function() {
            bgImageReady = true;
        }
        bgImage.src = bgImageSrc;

        player.image = new Image();
        player.image.onload = function() {
            player.imageReady = true;
            player.width = player.image.width;
            player.height = player.image.height;

            player.x = player.width;
            player.y = (HEIGHT - player.height) / 2;
        }
        player.image.src = player.imageSrc;

        ai.image = new Image();
        ai.image.onload = function() {
            ai.imageReady = true;
            ai.width = ai.image.width;
            ai.height = ai.image.height;

            ai.x = WIDTH - 2 * ai.width;
            ai.y = (HEIGHT - player.height) / 2;
        }
        ai.image.src = ai.imageSrc;

        ball.image = new Image();
        ball.image.onload = function() {
            ball.imageReady = true;
            ball.side = ball.image.width;
        }
        ball.image.src = ball.imageSrc;

        ball.serve(1);
    }

    function update() {
        ball.update();
        player.update();
        ai.update();
    }

    function draw() {
        if (bgImageReady) {
            context.drawImage(bgImage, 0, 0);
        }

        context.save();

        ball.draw();
        player.draw();
        ai.draw();

        context.restore();
    }

    this.startGame = function(elementId, directory) {
        canvas = document.getElementById(elementId);
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        context = canvas.getContext("2d");

        keystate = {};
        document.addEventListener("keydown", function(evt) {
            keystate[evt.keyCode] = true;
        });
        document.addEventListener("keyup", function(evt) {
            delete keystate[evt.keyCode];
        });

        init();

        bgImageSrc = directory + bgImageSrc;
        player.imageSrc = directory + player.imageSrc;
        ai.imageSrc = directory + ai.imageSrc;
        ball.imageSrc = directory + ball.imageSrc;

        var loop = function() {
            update();
            draw();

            window.requestAnimationFrame(loop, canvas);
        };
        window.requestAnimationFrame(loop, canvas);
    }
};
