class Paddle {

    constructor(posX, posY, width, height, color) {
        this.pos = { x: posX, y: posY }
        this.width = width;
        this.height = height;
        this.color = color;
    }

    move(evt) {
        var mouse = calculateMousePos(evt);
        if (mouse.x < this.width / 2) {
            this.pos.x = 0;
        } else if (mouse.x > canvas.width - this.width / 2) {
            this.pos.x = canvas.width - this.width;
        } else {
            this.pos.x = mouse.x - this.width / 2;
        }
    }
}