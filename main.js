const MOVEX = 2;
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

const BACKGROUND = [
    { image: document.getElementById("clouds"), x: 200, y: 0, width: 528, height: 200, },
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
    if (key == "space") player.noJump();
}

const getID = () => Math.random() * 1024;

const touching = (x1, x2, x3, x4) => {
    if (x1 > x3 && x1 < x4) return true;
    if (x2 > x3 && x2 <= x4) return true;
    return false;
}

const redraw = () => {
    // clear canvas
    ctx.clearRect(0, 0, CANVAS.x, CANVAS.y);
    checkInput();

    // ctx.beginPath();
    // ctx.rect(0,0,CANVAS.x,CANVAS.y);
    // ctx.fillStyle = "#aeccfc";
    // ctx.fill();

    // draw background
    for (let b of BACKGROUND) {
        ctx.drawImage(b.image, b.x - CANVAS.offset.x / 3, b.y + CANVAS.offset.y / 2, b.width, b.height);
    }

    // draw player, platforms and baddies
    for (let o of [player, ...baddies, ...platforms]) {

        o.update && o.update();

        ctx.beginPath();
        let l = o.getState();
        let fill = o.getFrame();
        ctx.rect(l.left - CANVAS.offset.x, CANVAS.y - l.top + CANVAS.offset.y, l.width, l.height);
        ctx.fillStyle = fill;
        ctx.fill();
    }

    window.requestAnimationFrame(redraw);
}

const baddies = LEVELOBJECTS
    .filter(obj => obj.type === "baddy")
    .map(obj => new Baddy(obj.x, obj.y, obj.width, obj.height, obj.color, obj.type));

const platforms = LEVELOBJECTS
    .filter(obj => obj.type === "platform")
    .map(obj => new Platform(obj.x, obj.y, obj.width, obj.height));

// const objects = LEVELOBJECTS
//     .filter(obj => obj.type !== "baddy" && obj.type !== "platform")
//     .map(obj => new Object(obj.x, obj.y, obj.width, obj.height, obj.color));

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