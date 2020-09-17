const MOVEX = 2;
const CANVAS = { x: 800, y: 600 };
const GRAVITY = .1;
const MAXSPEED = 10;
const JUMPHEIGHT = 2.5;
const KEYDOWN = {}
const KEYMAP = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    16: 'shift',
};

const LEFT = 0;
const RIGHT = 1;
const COLORS = ["black", "green", "yellow", "orange", "orangered", "red", "blue", "purple"];

const checkInput = () => {
    KEYDOWN['shift'] && player.run();
    (KEYDOWN['up'] || KEYDOWN['space']) && player.jump();
    KEYDOWN['left'] && player.move(LEFT);
    KEYDOWN['right'] && player.move(RIGHT);
};

const resetInput = (key) => {
    if (key == "right" || key == "left") player.stop();
    if (key == "shift") player.walk();
}

class Player {

    constructor(x, y) {
        this.SpeedY = 0;
        this.SpeedX = 1;
        this.Frame = 0;
        this.JumpBoost = 0;
        this.Width = 20;
        this.Height = 20;
        this.LocX = x - this.Width / 2;
        this.LocY = y - this.Height / 2
    }

    run = () => this.SpeedX = 2;

    walk = () => this.SpeedX = 1;

    stop = () => { this.SpeedX = 1; this.Frame = 0; }

    move = (direction) => {
        let x = 0;
        let y = 0;

        switch (direction) {
            case LEFT: x = -MOVEX * this.SpeedX; y = 0; break;
            case RIGHT: x = MOVEX * this.SpeedX; y = 0; break;
        }

        if (this.LocX + x + this.Width > CANVAS.x || this.LocX + x < 0) return;
        if (this.LocY + y + this.Height > CANVAS.y || this.LocY + y < 0) return;

        if (!this.jumping()) {
            this.Frame = (this.Frame++ % (COLORS.length - 2)) + 1;
        }
        this.LocX += x;
        this.LocY += y;
    }

    jumping = () => this.LocY + this.Height < CANVAS.y;

    jump = () => {

        if (this.JumpBoost > 0) {
            this.JumpBoost -= GRAVITY;
            this.SpeedY -= GRAVITY;
        }

        if (this.LocY + this.Height != CANVAS.y) return;
        this.JumpBoost = JUMPHEIGHT * 2;
        this.SpeedY = -JUMPHEIGHT;
        this.LocY--;
    }

    update = () => {
        if (this.jumping()) {

            this.Frame = COLORS.length - 1;

            if (this.SpeedY < MAXSPEED) this.SpeedY += GRAVITY;

            this.LocY += this.SpeedY;

            if (this.LocY + this.Height + this.SpeedY >= CANVAS.y) {
                this.LocY = CANVAS.y - this.Height;
                this.SpeedY = 0;
                this.Frame = 0;
            }
        }

        return {
            x: this.LocX,
            y: this.LocY,
            w: this.Width,
            h: this.Height,
            fill: COLORS[this.Frame],
        }
    }
}

const redraw = () => {
    ctx.beginPath();
    ctx.clearRect(0, 0, CANVAS.x, CANVAS.y);
    checkInput();
    p = player.update();
    ctx.rect(p.x, p.y, p.h, p.w);
    ctx.fillStyle = p.fill;
    ctx.fill();
    window.requestAnimationFrame(redraw);
}

const player = new Player(CANVAS.x / 2, CANVAS.y / 2);

document.addEventListener('keydown', (e) => KEYDOWN[KEYMAP[e.which]] = true);
document.addEventListener('keyup', (e) => {
    KEYDOWN[KEYMAP[e.which]] = false;
    resetInput(KEYMAP[e.which]);
});

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", CANVAS.x)
canvas.setAttribute("height", CANVAS.y)
redraw();