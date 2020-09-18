const MOVEX = 2;
const CANVAS = { x: 800, y: 400 };
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
        this.LocY = y - this.Height / 2;
        this.Bounds = { top: 0, right: CANVAS.x, bottom: CANVAS.y, left: 0 };
    }

    setBound = (bound, val) => this.Bounds[bound] = val;

    run = () => this.SpeedX = 2;

    walk = () => this.SpeedX = 1;

    stop = () => { this.SpeedX = 1; this.Frame = 0; }


    getBounds = () => {

        let b = { top: 0, right: CANVAS.x, bottom: CANVAS.y, left: 0 };

        for (let o of objects) {
            let s = o.getState();
            if (touching(this.LocX, this.LocX + this.Width, s.x, s.x + s.w)) {
                if (this.LocY + this.Height <= s.y && s.y < b.bottom) b.bottom = s.y;
                if (this.LocY > s.y + s.h && s.y + s.h >= b.top) b.top = s.y + s.h;
            }
            if (touching(this.LocY, this.LocY + this.Height, s.y, s.y + s.h)) {
                if (this.LocX + this.Width <= s.x && s.x < b.right) b.right = s.x;
                if (this.LocX > s.x + s.w && s.x + s.w >= b.left) b.left = s.x + s.w;
            }
        }

        this.Bounds = b;
    }

    move = (direction) => {
        let x = 0;
        let y = 0;

        switch (direction) {
            case LEFT: x = -MOVEX * this.SpeedX; y = 0; break;
            case RIGHT: x = MOVEX * this.SpeedX; y = 0; break;
        }

        this.getBounds()
        console.log(this.Bounds, this.LocX, this.LocY + this.Height);
        if (this.LocX + x + this.Width >= this.Bounds.right || this.LocX + x <= this.Bounds.left) return;

        if (!this.jumping()) {
            this.Frame = (this.Frame++ % (COLORS.length - 2)) + 1;
        }
        this.LocX += Math.round(x);
        this.LocY += Math.round(y);
    }

    jumping = () => this.LocY + this.Height < this.Bounds.bottom;

    jump = () => {

        if (this.JumpBoost > 0) {
            this.JumpBoost -= GRAVITY;
            this.SpeedY -= GRAVITY;
        }

        if (this.LocY + this.Height != this.Bounds.bottom) return;
        this.JumpBoost = JUMPHEIGHT * 2;
        this.SpeedY = -JUMPHEIGHT;
        this.LocY--;
    }

    update = () => {
        if (this.jumping()) {

            this.Frame = COLORS.length - 1;

            if (this.SpeedY < MAXSPEED) this.SpeedY += GRAVITY;

            this.LocY += Math.round(this.SpeedY);

            if (this.LocY + this.Height + this.SpeedY >= this.Bounds.bottom) {
                this.LocY = this.Bounds.bottom - this.Height;
                this.SpeedY = 0;
                this.Frame = 0;
            }
        }
    }

    getState = () => {
        return {
            x: this.LocX,
            y: this.LocY,
            w: this.Width,
            h: this.Height,
            fill: COLORS[this.Frame],
        }
    }
}


class Thing {

    Width = 50;
    Height = 50;
    Fill = "orangered";

    constructor(x, y) {
        this.LocX = x - this.Width;
        this.LocY = y - this.Height;
    }

    getState() {
        return {
            x: this.LocX,
            y: this.LocY,
            w: this.Width,
            h: this.Height,
            fill: this.Fill,
        }
    }
}

const touching = (x1, x2, x3, x4) => {
    if (x1 >= x3 && x1 <= x4) return true;
    if (x2 >= x3 && x2 <= x4) return true;
    return false;
}

const redraw = () => {
    ctx.beginPath();
    ctx.clearRect(0, 0, CANVAS.x, CANVAS.y);
    checkInput();
    //checkCollision();

    player.update();
    p = player.getState();
    ctx.rect(p.x, p.y, p.h, p.w);
    ctx.fillStyle = p.fill;
    ctx.fill();

    for (let o of objects) {
        ctx.beginPath();
        let l = o.getState();
        ctx.rect(l.x, l.y, l.w, l.h);
        ctx.fillStyle = l.fill;
        ctx.fill();
    }

    window.requestAnimationFrame(redraw);
}

const player = new Player(CANVAS.x / 2, CANVAS.y / 2);
const objects = [
    new Thing(Math.round(CANVAS.x / 3), CANVAS.y),
    new Thing(Math.round(CANVAS.x / 2), 3*  Math.round(CANVAS.y/4)),
]

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