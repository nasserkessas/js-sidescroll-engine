const MOVEX = 2;
const CANVAS = { x: 800, y: 450, offset: { x: 0, y: 0 } };
const LEVEL = { x: 1600, y: 700 };
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
const COLORS = ["black", "green", "yellow", "orange", "orangered", "red", "blue", "purple", "cyan"];
const THINGS = [
    { x: 0, y: 0, width: LEVEL.x, height: 25, color: "brown", type: "platform" }, //ground
    { x: 0, y: 25, width: LEVEL.x, height: 7, color: "#60ff30", type: "grass" }, //grass
    { x: 550, y: 7 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 300, y: 5.5 / 10 * CANVAS.y, width: 75, height: 25, color: "brown", type: "platform" }, //platform
    { x: 650, y: 4 / 10 * CANVAS.y, width: 150, height: 25, color: "brown", type: "platform" }, //platform
    { x: 0, y: 5 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 150, y: 8 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 100, y: 5 / 10 * CANVAS.y, width: 25, height: 100, color: "brown", type: "platform" }, //vertical platform
    { x: 450, y: 3 / 10 * CANVAS.y, width: 25, height: 50, color: "brown", type: "platform" }, //vertical platform
    { x: 550, y: 3 / 10 * CANVAS.y, width: 25, height: 50, color: "brown", type: "platform" }, //vertical platform
    { x: 650, y: 4 / 10 * CANVAS.y, width: 25, height: 160, color: "brown", type: "platform" }, //vertical platform
    { x: 450, y: 3 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 500, y: 14 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 400, y: 11 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 100, y: 2.5 / 10 * CANVAS.y, width: 100, height: 25, color: "brown", type: "platform" }, //platform
    { x: 700, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    { x: 80, y: 5 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    { x: 505, y: 3 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    { x: 80, y: 5 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 750, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 80, y: 100, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 160, y: 32, width: 20, height: 20, color: "red", type: "baddy" },  //baddy


];

const checkInput = () => {
    KEYDOWN['shift'] && player.run();
    KEYDOWN['space'] && player.jump();
    KEYDOWN['right'] && player.move(RIGHT);
    KEYDOWN['left'] && player.move(LEFT);
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

class Platform extends Thing {
    constructor(x, y, w, h) {
        super(x, y, w, h || 25, "brown")
    }
}


class MovingThing extends Thing {

    Frame = 0;

    constructor(x, y, w, h, f, t) {
        super(x, y, w, h, f);
        this.SpeedY = 0;
        this.SpeedX = 1;
        this.JumpBoost = 0;
        this.Type = t;
    }

    setFrame = f => { this.Frame = f; this.Fill = COLORS[f] }

    getBounds = (objs) => {
        let b = { top: { loc: LEVEL.y, obj: { Type: "canvas" } }, right: { loc: LEVEL.x, obj: { Type: "canvas" } }, bottom: { loc: 0, obj: { Type: "canvas" } }, left: { loc: 0, obj: { Type: "canvas" } } };

        for (let o of objs) {
            let s = o.getState();
            if (touching(this.Left, this.Right, s.left, s.right)) {
                if (this.Bottom >= s.top && s.top > b.bottom.loc) { b.bottom.loc = s.top; b.bottom.obj = o };
                if (this.Top < s.bottom && s.bottom <= b.top.loc) { b.top.loc = s.bottom; b.top.obj = o };
            }
            if (touching(this.Bottom, this.Top, s.bottom, s.top)) {
                if (this.Right <= s.left && s.left < b.right.loc) { b.right.loc = s.left; b.right.obj = o }
                if (this.Left >= s.right && s.right > b.left.loc) { b.left.loc = s.right; b.left.obj = o }
            }
        }
        this.Bounds = b;
    }

    run = () => this.SpeedX = 1.5;

    walk = () => this.SpeedX = 1;

    stop = () => { this.SpeedX = 1; this.setFrame(0); }

}

class Baddy extends MovingThing {

    constructor(x, y, w, h, f, t) {
        super(x, y, w, h, f);
        this.Top = y + this.Height;
        this.Left = x;
        this.Bottom = y;
        this.Right = x + this.Width;
        this.Direction = LEFT;
        this.Speed = 1;
        this.Type = t;
    }

    update = () => {
        this.setFrame((this.Frame++ % (COLORS.length - 3)) + 1);

        this.getBounds([player, ...objects, ...baddies]);
        if (this.Direction === LEFT) {
            if (this.Bounds.left.loc >= this.Left) { this.Direction = RIGHT; return; }
            this.coords(this.Left - this.Speed, this.Top);
        }
        if (this.Direction === RIGHT) {
            if (this.Bounds.right.loc <= this.Right) { this.Direction = LEFT; return; }
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
            case LEFT:
                x = -MOVEX * this.SpeedX;
                if ((this.Left < CANVAS.offset.x + CANVAS.x / 2) && CANVAS.offset.x > 0) CANVAS.offset.x += x;
                break;
            case RIGHT:
                x = MOVEX * this.SpeedX;
                if ((this.Left > CANVAS.offset.x + CANVAS.x / 2) && CANVAS.offset.x + CANVAS.x < LEVEL.x) CANVAS.offset.x += x;
                break;
        }

        this.getBounds([...objects, ...baddies])
        if (this.Right + x > this.Bounds.right.loc) x = this.Bounds.right.loc - this.Right;
        if (this.Left + x < this.Bounds.left.loc) x = this.Bounds.left.loc - this.Left;

        if (!this.jumping()) {
            this.setFrame((this.Frame++ % (COLORS.length) - 2));
        }
        this.coords(this.Left + x, this.Top);
    }

    jumping = () => this.Bottom > this.Bounds.bottom.loc;

    goingUp = () => {
        if (this.SpeedY > 0) { return true }
        else return false
    }

    jump = () => {

        if (this.JumpBoost > 0) {
            this.JumpBoost += GRAVITY;
            this.SpeedY -= GRAVITY;
        }

        if (this.Bottom != this.Bounds.bottom.loc) return;
        this.JumpBoost = JUMPHEIGHT * 2;
        this.SpeedY = JUMPHEIGHT;
        this.coords(this.Left, this.Top + 1)
    }

    update = () => {

        this.getBounds([...objects, ...baddies])

        if (this.jumping()) {

            this.setFrame(COLORS.length - 2);

            if (this.SpeedY < MAXSPEED) this.SpeedY += GRAVITY; // if not max speed

            if (this.Top + this.SpeedY > this.Bounds.top.loc) { // if going to hit top bounds
                this.coords(this.Left, this.Bounds.top.loc);
                this.SpeedY = 0;
                this.JumpBoost = 0;
            }

            this.coords(this.Left, this.Top + this.SpeedY); // update height

            if (player.Bottom + this.SpeedY > CANVAS.y / 2) { // if not below half way
                if (CANVAS.offset.y + this.SpeedY + CANVAS.y < LEVEL.y) { // if not going to go over level.y
                    if (!this.goingUp() && player.Bottom + this.SpeedY < CANVAS.y / 2 + CANVAS.offset.y) {
                        CANVAS.offset.y += this.SpeedY;
                    }
                    if (this.goingUp()) {
                        CANVAS.offset.y += this.SpeedY;
                    }
                }
            }
            if (this.Bottom - (CANVAS.y / 2) < 0) { // reset canvas y offset smoothly
                if (CANVAS.offset.y >= 0) {
                    CANVAS.offset.y -= 5;
                }
                if (CANVAS.offset.y < 0) {
                    CANVAS.offset.y = 0
                }
            }

            if (this.Bottom + this.SpeedY <= this.Bounds.bottom.loc) { // if on bottom bounds
                this.coords(this.Left, this.Bounds.bottom.loc + this.Height);
                this.SpeedY = 0;
                this.setFrame(0);
            }
        }
    }
}

const touching = (x1, x2, x3, x4) => {
    if (x1 > x3 && x1 < x4) return true;
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
        ctx.rect(l.left - CANVAS.offset.x, CANVAS.y - l.top + CANVAS.offset.y, l.width, l.height);
        ctx.fillStyle = l.fill;
        ctx.fill();
    }

    window.requestAnimationFrame(redraw);
}

const baddies = THINGS
    .filter(obj => obj.type === "baddy")
    .map(obj => new Baddy(obj.x, obj.y, obj.width, obj.height, obj.color, obj.type));

const objects = THINGS
    .filter(obj => obj.type !== "baddy")
    .map(obj => new Thing(obj.x, obj.y, obj.width, obj.height, obj.color));


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