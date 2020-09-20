const MOVEX = 2;
const CANVAS = { x: 800, y: 450 };
const GRAVITY = -.2;
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
    // { x: 0, y: 0, width: CANVAS.x/3, height: 25, color: "brown" }, //ground

    { x: 0, y: 0, width: CANVAS.x, height: 25, color: "brown" }, //grass
    { x: 0, y: 25, width: CANVAS.x, height: 7, color: "#60ff30" }, //ground
    { x: 550, y: 7 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 300, y: 5 / 10 * CANVAS.y, width: 75, height: 25, color: "brown" }, //platform
    { x: 650, y: 4 / 10 * CANVAS.y, width: 150, height: 25, color: "brown" }, //platform
    { x: 00, y: 5 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 100, y: 90, width: 100, height: 25, color: "brown" }, //platform
    { x: 80, y: 3 / 10 * CANVAS.y + 25, width: 50, height: 20, color: "brown" }, //platform

    { x: 700, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" }  //goal
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
        this.Left = x;
        this.Top = y + height;
        this.Bottom = y;
        this.Right = x + width;
        this.fill = fill;
    }

    getState() {
        return {
            top: this.Top,
            right: this.Right,
            bottom: this.Bottom,
            width: this.Width,
            height: this.Height,
            left: this.Left,
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
        this.Top = y + this.Height;
        this.Left = x;
        this.Bottom = y;
        this.Right = x + this.Width;
        this.Bounds = { top: CANVAS.y, right: CANVAS.x, bottom: 0, left: 0 };
        this.Fill = COLORS[this.Frame];
        this.getBounds();
    }

    getBounds = () => {
        let b = { top: CANVAS.y, right: CANVAS.x, bottom: 0, left: 0 };

        for (let o of objects) {
            let s = o.getState();
            if (touching(this.Left, this.Right, s.left, s.right)) {
                if (this.Bottom >= s.top && s.top > b.bottom) b.bottom = s.top;
                if (this.Top < s.bottom && s.bottom <= b.top) b.top = s.bottom;
            }
            if (touching(this.Bottom, this.Top, s.bottom, s.top)) {
                if (this.Right <= s.left && s.left < b.right) b.right = s.left;
                if (this.Left >= s.right && s.right > b.left) b.left = s.right;
            }
        }

        this.Bounds = b;
    }

    move = (direction) => {
        let x = 0;

        switch (direction) {
            case LEFT: x = -MOVEX * this.SpeedX; break;
            case RIGHT: x = MOVEX * this.SpeedX; break;
        }

        this.getBounds()
        if (this.Right + x > this.Bounds.right) x = this.Bounds.right - this.Right;
        if (this.Left + x < this.Bounds.left) x = this.Bounds.left - this.Left;

        if (!this.jumping()) {
            this.Frame = (this.Frame++ % (COLORS.length - 2)) + 1;
        }
        this.coords(this.Left + x, this.Top);
    }

    coords = (x, y) => { this.Left = x; this.Top = y; this.Right = x + this.Width; this.Bottom = y - this.Height; }

    jumping = () => this.Bottom > this.Bounds.bottom;

    jump = () => {

        if (this.JumpBoost > 0) {
            this.JumpBoost += GRAVITY;
            this.SpeedY -= GRAVITY;
        }

        if (this.Bottom != this.Bounds.bottom) return;
        this.JumpBoost = JUMPHEIGHT * 2;
        this.SpeedY = JUMPHEIGHT;
        this.coords(this.Left, this.Top + 1)
    }

    update = () => {

        if (this.jumping()) {

            this.Frame = COLORS.length - 1;

            if (this.SpeedY < MAXSPEED) this.SpeedY += GRAVITY;

            if (this.Top + this.SpeedY > this.Bounds.top) {
                this.coords(this.Left, this.Bounds.top);
                this.SpeedY = 0;
            }
            this.coords(this.Left, this.Top + this.SpeedY);

            if (this.Bottom + this.SpeedY <= this.Bounds.bottom) {
                this.coords(this.Left, this.Bounds.bottom + this.Height);
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
        ctx.rect(l.left, CANVAS.y - l.top, l.width, l.height);
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