class Ball {
    constructor(posX, posY, mouseX, mouseY) {
        this.pos = { x: posX, y: posY };

        var speeds = getSpeeds(posX, posY, mouseX, mouseY);

        this.speed = { x: speeds.x, y: speeds.y }; //CHANGE X TO THE DIRECTION OF THE MOUSE
    }

    move() {
        if (win) {
            ball = null;
            return;
        }
        if (hitWithBrick(this.pos.x, this.pos.y)) {
            this.speed.y = -this.speed.y;
        }
        if (this.pos.y >= (paddle.pos.y - paddle.height) && this.pos.x > (paddle.pos.x) && this.pos.x < (paddle.pos.x + paddle.width)) {

            this.speed.y = -this.speed.y;

            var deltaX = this.pos.x - (paddle.pos.x + paddle.width / 2);

            this.speed.x = -(deltaX * 0.1);

            var sum = (Math.abs(this.speed.y) + Math.abs(this.speed.x));

            var newSpeedX = (this.speed.x * 100) / sum;
            var newSpeedY = (this.speed.y * 100) / sum;

            this.speed.x = (GAME_DIFFICULTY / 100) * newSpeedX;
            this.speed.y = (GAME_DIFFICULTY / 100) * newSpeedY;

        }
        if (this.pos.y > canvas.height - BALL_SIZE) {
            ball = null;
            if (lives < 1) {
                lost = true;
            } else {
                lives--;
            }
            return;
        }
        if (this.pos.y < BALL_SIZE) {
            this.speed.y = -this.speed.y;
        }
        this.pos.y -= this.speed.y;

        if (this.pos.x > canvas.width - BALL_SIZE || this.pos.x < BALL_SIZE) {
            this.speed.x = -this.speed.x;
        }
        this.pos.x -= this.speed.x;


    }
}