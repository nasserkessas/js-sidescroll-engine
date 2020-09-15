const MoveX = 2;
const MoveY = 2;
const Width = 20;
const Height = 20;
const CanvasX = 800;
const CanvasY = 600;
let SpeedY = 0;
let SpeedX = 0;
let State = 0;
const Gravity = .1;
const JumpHeight = 5;
const MaxSpeed = 10;
const keyDown = {},
    keyMap = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
const colors = ["black", "green", "yellow", "orange", "orangered", "red", "blue", "purple"];

const canvas = document.querySelector("#canvas")
canvas.setAttribute("width", CanvasX)
canvas.setAttribute("height", CanvasY)
const ctx = canvas.getContext("2d");


squarex = CanvasX / 2 - Width / 2
squarey = CanvasY / 2 - Height / 2

const checkInput = () => {
    if (keyDown['up'] || keyDown['space']) {
        jump()
    }
    if (keyDown['down']) {
        // down code
    }
    if (keyDown['left']) {
        move(-MoveX, 0)
    }
    if (keyDown['right']) {
        move(MoveX, 0)
    }
};

const resetInput = (key) => {
    if (key == "right" || key == "left") State = 0;
}

document.addEventListener('keydown', (e) => keyDown[keyMap[e.which]] = true);
document.addEventListener('keyup', (e) => {
    keyDown[keyMap[e.which]] = false;
    resetInput(keyMap[e.which]);
});

function move(x, y) {

    if (squarex + x + Width > CanvasX || squarex + x < 0) return;
    if (squarey + y + Height > CanvasY || squarey + y < 0) return;

    if (jumping()) {
        State = colors.length - 1;
    } else {
        State = (State++ % (colors.length - 2)) + 1;
    }
    squarex += x;
    squarey += y;
}

const jumping = () => squarey + Height < CanvasY;

function jump() {
    if (squarey + Height != CanvasY) return;
    SpeedY = -JumpHeight;
    squarey--;
}

function redraw() {
    if (jumping()) {

        if (SpeedY < MaxSpeed) SpeedY += Gravity;
        squarey += SpeedY;

        if (squarey + Height + SpeedY >= CanvasY) {
            squarey = CanvasY - Height;
            SpeedY = 0;
        }
    }

    ctx.beginPath();
    ctx.clearRect(0,0,CanvasX,CanvasY);
    ctx.rect(squarex, squarey, Width,  Height);
    ctx.fillStyle = colors[State];
    ctx.fill();
    checkInput();

    window.requestAnimationFrame(redraw);
}

const color = (y) => (1 - y / (CanvasY - Height)) * 512;

redraw();