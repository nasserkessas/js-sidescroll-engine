const MOVEX = 2;
const CANVAS = { x: 800, y: 450 };
const GRAVITY = .2;
const MAXSPEED = 10;
const JUMPHEIGHT = 3.5;
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
const LEVEL = [
    { x: 0, y: 0, width: CANVAS.x, height: 25, color: "brown" }, //grass
    { x: 0, y: 25, width: CANVAS.x, height: 7, color: "#60ff30" }, //ground
    { x: 550, y: 7 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 300, y: 5 / 10 * CANVAS.y, width: 75, height: 25, color: "brown" }, //platform
    { x: 650, y: 4 / 10 * CANVAS.y, width: 150, height: 25, color: "brown" }, //platform
    { x: 100, y: 3 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 650, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" }  //goal
];

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


class Thing {

    Frame = 0;

    constructor(x, y, width, height, fill) {
        this.Width = width;
        this.Height = height;
        this.LocX = x;
        this.LocY = (CANVAS.y - y) - height;
        this.fill = fill;
    }

    getState() {
        return {
            x: this.LocX,
            y: this.LocY,
            w: this.Width,
            h: this.Height,
            fill: this.fill || COLORS[this.Frame !== undefined ? this.Frame : 4],
        }
    }
}


class MovingThing extends Thing {

    constructor() {
        super();
        this.SpeedY = 0;
        this.SpeedX = 1;
        this.JumpBoost = 0;
    }

    run = () => this.SpeedX = 1.5;

    walk = () => this.SpeedX = 1;

    stop = () => { this.SpeedX = 1; this.Frame = 0; }
}

class Player extends MovingThing {

    constructor(x, y) {
        super();
        this.Width = 20;
        this.Height = 20;
        this.LocX = x - this.Width / 2;
        this.LocY = y - this.Height / 2;
        this.Bounds = { top: 0, right: CANVAS.x, bottom: CANVAS.y, left: 0 };
        this.Fill = COLORS[this.Frame];
        this.getBounds();
    }

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
                if (this.LocX >= s.x + s.w && s.x + s.w > b.left) b.left = s.x + s.w;
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

        if (this.LocX + this.Width + x > this.Bounds.right) x = this.Bounds.right - (this.LocX + this.Width);
        if (this.LocX + x < this.Bounds.left) x = this.Bounds.left - this.LocX;

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

            if (this.LocY + Math.round(this.SpeedY) < this.Bounds.top) {
                this.LocY = this.Bounds.top;
                this.SpeedY = 0;
            }
            else
                this.LocY += Math.round(this.SpeedY);

            if (this.LocY + this.Height + this.SpeedY >= this.Bounds.bottom) {
                this.LocY = this.Bounds.bottom - this.Height;
                this.SpeedY = 0;
                this.Frame = 0;
            }
        }
    }
}


const touching = (x1, x2, x3, x4) => {
    if (x1 >= x3 && x1 <= x4) return true;
    if (x2 >= x3 && x2 <= x4) return true;
    return false;
}

const redraw = () => {
    ctx.clearRect(0, 0, CANVAS.x, CANVAS.y);
    checkInput();

    player.update();

    for (let o of [player, ...objects]) {
        ctx.beginPath();
        let l = o.getState();
        ctx.rect(l.x, l.y, l.w, l.h);
        ctx.fillStyle = l.fill;
        ctx.fill();
    }

    window.requestAnimationFrame(redraw);
}

const objects = LEVEL.map(obj => new Thing(obj.x, obj.y, obj.width, obj.height, obj.color));

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