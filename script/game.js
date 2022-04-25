var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");

const GAME_DIFFICULTY = 10;
const BALL_SIZE = 15;
const fps = 60;

var numOfBricks = getRandomArbitrary(20, 40);

var widthBricks = 100;
var heightBricks = 20;

var lives = 5;
var ball = null;
var paddle = null;
var bricks = [];

var lost = false;
var win = false;

function hitWithBrick(x, y) {

    for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i].pos;
        if (x + BALL_SIZE > b.x && x - BALL_SIZE < b.x + widthBricks && y + BALL_SIZE > b.y && y - BALL_SIZE < b.y + heightBricks) {
            bricks.splice(i, 1);
            return true;
        }
    }

    return false;
}

function getSpeeds(posX, posY, mouseX, mouseY) {

    var y = Math.abs(mouseY - posY);

    var x = Math.abs(mouseX - posX);

    var percentDeltaX = Math.round((x * 100) / (x + y));
    var percentDeltaY = Math.round((y * 100) / (x + y));

    var speedX = (GAME_DIFFICULTY / 100) * percentDeltaX;
    var speedY = (GAME_DIFFICULTY / 100) * percentDeltaY;

    if (mouseX - posX > 0) {
        speedX = -speedX;
    }

    return {
        x: speedX,
        y: speedY
    }
}


window.onload = function() {

    generateBricks();

    paddle = new Paddle((canvas.width / 2) - 75, canvas.height - 20 - 20, 150, 20, "white");

    setInterval(gameLoop, 1000 / fps);

    canvas.addEventListener('mousemove', function(evt) {
        if (paddle != null && ball != null) {
            paddle.move(evt);
        }
    });

    canvas.addEventListener("mousedown", function(evt) {
        var mouse = calculateMousePos(evt);
        if (lost || win) {
            lost = false;
            generateBricks();
            win = false;
            lives = 5;
        } else if (ball == null && mouse.y < canvas.height - 100) {
            paddle.pos.x = (canvas.width / 2) - 75;
            addBall(mouse.x, mouse.y);
        }
    });

};

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - 1 - min) + min);
}

function generateBricks() {
    var colors = ["white", "green", "yellow", "orange", "red", "blue", "purple", "pink"];
    var randomHeights = [heightBricks + 5, 40 + heightBricks];

    var numBricksPerRow = Math.floor((canvas.width - 20) / (widthBricks + 20));
    var posX = 20;
    var posY = 30;
    var count = 0;

    for (var i = 0; i < numOfBricks; i++) {
        var col = colors[getRandomArbitrary(0, colors.length)];
        bricks.push(new Brick(posX, posY, col));
        if (count == numBricksPerRow) {
            count = 0;
            posY += randomHeights[Math.round(Math.random())];
            posX = 20;
        } else {
            var rand = getRandomArbitrary(0, 4);
            if (rand == 0 || rand == 1) {
                posX += widthBricks + 10;
            } else {
                if (posX + (widthBricks + 10) * 2 < canvas.width - widthBricks + 20) {
                    posX += (widthBricks + 10) * 2;
                    count++;
                }
            }

            count++;
        }

    }

}

function addBall(mouseX, mouseY) {
    ball = new Ball(canvas.width / 2 - BALL_SIZE, canvas.height - BALL_SIZE - paddle.height - 30, mouseX, mouseY);
}

function gameLoop() {
    if (bricks.length < 1) {
        win = true;
    }

    show();

    update();

}

function update() {


    //UPDATE BALL    
    if (ball != null) {
        ball.move();
    }

}

function show() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    //DRAW BLACK RECT
    drawRect(0, 0, canvas.width, canvas.height, "black");

    //DISPLAY "Press anywhere to launch the ball"
    if (ball == null) {
        canvasContext.font = "30px Arial";
        canvasContext.fillStyle = "white";
        canvasContext.textAlign = "center";
        canvasContext.fillText("Press anywhere to launch the ball", canvas.width / 2, canvas.height - 100);
    }

    //DRAW BRICKS    
    bricks.forEach(element => {
        drawRect(element.pos.x, element.pos.y, widthBricks, heightBricks, element.color);
    });


    //DRAW PADDLE
    drawRect(paddle.pos.x, paddle.pos.y, paddle.width, paddle.height, paddle.color);

    //SHOW BALL
    if (ball != null) {
        drawCircle(ball.pos.x, ball.pos.y, BALL_SIZE, "RED");
    }

    //SHOW LIVES
    if (!lost && !win) {
        canvasContext.font = "20px Arial";
        canvasContext.fillStyle = "white";
        canvasContext.textAlign = "left";
        canvasContext.fillText("Lives remaining: " + lives, 5, paddle.pos.y - 20);
    }


    if (lost) {
        canvasContext.font = "20px Arial";
        canvasContext.fillStyle = "red";
        canvasContext.textAlign = "center";
        canvasContext.fillText("YOU LOST! (click to start a new game)", canvas.width / 2, canvas.height / 2 + 50);
    }

    if (win) {
        canvasContext.font = "20px Arial";
        canvasContext.fillStyle = "green";
        canvasContext.textAlign = "center";
        canvasContext.fillText("YOU WON! (click to start a new game)", canvas.width / 2, canvas.height / 2 + 50);
    }

}

function drawRect(leftX, topY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}

function drawCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}