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
    115: 's',
};

const LEFT = 0;
const RIGHT = 1;
const COLORS = ["black", "green", "yellow", "orange", "orangered", "red", "blue", "purple"];
const LEVEL = [
    { x: 0, y: 0, width: CANVAS.x, height: 25, color: "brown" }, //ground
    { x: 0, y: 25, width: CANVAS.x, height: 7, color: "#60ff30" }, //grass
    { x: 550, y: 7 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 300, y: 5 / 10 * CANVAS.y, width: 75, height: 25, color: "brown" }, //platform
    { x: 650, y: 4 / 10 * CANVAS.y, width: 150, height: 25, color: "brown" }, //platform
    { x: 0, y: 5 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 150, y: 8 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 100, y: 5 / 10 * CANVAS.y, width: 25, height: 100, color: "brown" }, //vertical platform
    { x: 100, y: 5 / 10 * CANVAS.y, width: 25, height: 100, color: "brown" }, //vertical platform
    { x: 450, y: 3 / 10 * CANVAS.y, width: 25, height: 50, color: "brown" }, //vertical platform
    { x: 550, y: 3 / 10 * CANVAS.y, width: 25, height: 50, color: "brown" }, //vertical platform
    { x: 450, y: 3 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 100, y: 2 / 10 * CANVAS.y, width: 100, height: 25, color: "brown" }, //platform
    { x: 700, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    { x: 80, y: 5 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    { x: 80, y: 32, width: 20, height: 20, color: "red", type: "baddy" },  //goal
    { x: 160, y: 32, width: 20, height: 20, color: "red", type: "baddy" },  //goal


];

const checkInput = () => {
    KEYDOWN['shift'] && player.run();
    KEYDOWN['space'] && player.jump();
    KEYDOWN['left'] && player.move(LEFT);
    KEYDOWN['right'] && player.move(RIGHT);
    KEYDOWN['s'] && player.dumpStats();
};

const resetInput = (key) => {
    if (key == "right" || key == "left") player.stop();
    if (key == "shift") player.walk();
}


class Thing {

    constructor(x, y, width, height, fill) {
        this.Width = width;
        this.Height = height;
        this.Left = x;
        this.Top = y + height;
        this.Bottom = y;
        this.Right = x + width;
        this.Fill = fill;
    }

    coords = (x, y) => { this.Left = x; this.Top = y; this.Right = x + this.Width; this.Bottom = y - this.Height; }

    getState() {
        return {
            top: this.Top,
            right: this.Right,
            bottom: this.Bottom,
            width: this.Width,
            height: this.Height,
            left: this.Left,
            fill: this.Fill || COLORS[this.Frame !== undefined ? this.Frame : 4],
        }
    }
}


class MovingThing extends Thing {

    Frame = 0;

    constructor(x, y, w, h, f) {
        super(x, y, w, h, f);
        this.SpeedY = 0;
        this.SpeedX = 1;
        this.JumpBoost = 0;
    }

    setFrame = f => { this.Frame = f; this.Fill = COLORS[f] }

    getBounds = (objs) => {
        let b = { top: CANVAS.y, right: CANVAS.x, bottom: 0, left: 0 };

        for (let o of objs) {
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

    run = () => this.SpeedX = 1.5;

    walk = () => this.SpeedX = 1;

    stop = () => { this.SpeedX = 1; this.setFrame(0); }

}

class Baddy extends MovingThing {

    constructor(x, y, w, h, f) {
        super(x, y, w, h, f);
        this.Top = y + this.Height;
        this.Left = x;
        this.Bottom = y;
        this.Right = x + this.Width;
        this.Direction = LEFT;
        this.Speed = 1;
    }

    update = () => {
        this.setFrame((this.Frame++ % (COLORS.length - 2)) + 1);

        this.getBounds([player, ...objects, ...baddies]);
        if (this.Direction === LEFT) {
            if (this.Bounds.left >= this.Left) { this.Direction = RIGHT; return; }
            this.coords(this.Left - this.Speed, this.Top);
        }
        if (this.Direction === RIGHT) {
            if (this.Bounds.right <= this.Right) { this.Direction = LEFT; return; }
            this.coords(this.Left + this.Speed, this.Top);
        }
    }
}

class Player extends MovingThing {

    constructor(x, y) {
        super(x, y, 20, 20, COLORS[0]);
        this.Top = y + this.Height;
        this.Left = x;
        this.Bottom = y;
        this.Right = x + this.Width;
    }


    move = (direction) => {
        let x = 0;

        switch (direction) {
            case LEFT: x = -MOVEX * this.SpeedX; break;
            case RIGHT: x = MOVEX * this.SpeedX; break;
        }

        this.getBounds([...objects, ...baddies])
        if (this.Right + x > this.Bounds.right) x = this.Bounds.right - this.Right;
        if (this.Left + x < this.Bounds.left) x = this.Bounds.left - this.Left;

        if (!this.jumping()) {
            this.setFrame((this.Frame++ % (COLORS.length - 2)) + 1);
        }
        this.coords(this.Left + x, this.Top);
    }

    jumping = () => this.Bottom > this.Bounds.bottom;

    dumpStats = () => {
        console.log({ bounds: this.Bounds, loc: { right: this.Right, left: this.Left, top: this.Top, bottom: this.Bottom}});
    }

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

        this.getBounds([...objects, ...baddies])

        if (this.jumping()) {

            this.setFrame(COLORS.length - 1);

            if (this.SpeedY < MAXSPEED) this.SpeedY += GRAVITY;

            if (this.Top + this.SpeedY > this.Bounds.top) {
                this.coords(this.Left, this.Bounds.top);
                this.SpeedY = 0;
                this.JumpBoost = 0;
            }
            this.coords(this.Left, this.Top + this.SpeedY);

            if (this.Bottom + this.SpeedY <= this.Bounds.bottom) {
                this.coords(this.Left, this.Bounds.bottom + this.Height);
                this.SpeedY = 0;
                this.setFrame(0);
            }
        }
    }
}

const touching = (x1, x2, x3, x4) => {
    if (x1 > x3 && x1 <= x4) return true;
    if (x2 > x3 && x2 <= x4) return true;
    return false;
}

const redraw = () => {
    ctx.clearRect(0, 0, CANVAS.x, CANVAS.y);
    checkInput();


    for (let o of [player, ...objects, ...baddies]) {
        o.update && o.update();

        ctx.beginPath();
        let l = o.getState();
        ctx.rect(l.left, CANVAS.y - l.top, l.width, l.height);
        ctx.fillStyle = l.fill;
        ctx.fill();
    }

    window.requestAnimationFrame(redraw);
}

const baddies = LEVEL
    .filter(obj => obj.type === "baddy")
    .map(obj => new Baddy(obj.x, obj.y, obj.width, obj.height, obj.color));

const objects = LEVEL
    .filter(obj => obj.type !== "baddy")
    .map(obj => new Thing(obj.x, obj.y, obj.width, obj.height, obj.color));

const player = new Player(CANVAS.x / 2, CANVAS.y / 2);

document.addEventListener('keydown', (e) => KEYDOWN[KEYMAP[e.which]] = true);
document.addEventListener('keyup', (e) => {
    KEYDOWN[KEYMAP[e.which]] = false;
    resetInput(KEYMAP[e.which]);
});
document.addEventListener('keypress', (e) => {
    switch (e.which) {
        case 115: player.dumpStats(); break;
    }
});

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", CANVAS.x)
canvas.setAttribute("height", CANVAS.y)
redraw();