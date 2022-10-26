const CANVAS = { x: 800, y: 500, offset: { x: 0, y: 0 } };

const LEVEL = { x: 1600, y: 800 };

const LEVELOBJECTS = [
    { x: 0, y: 0, width: LEVEL.x, height: 1, type: "platform" }, //ground
    { x: 22, y: 14, width: 5, height: 1, type: "platform" }, //platform
    { x: 12, y: 11, width: 3, height: 1, type: "platform" }, //platform
    { x: 26, y: 8, width: 6, height: 1, type: "platform" }, //platform
    { x: 0, y: 10, width: 4, height: 1, type: "platform" }, //platform
    { x: 6, y: 16, width: 4, height: 1, type: "platform" }, //platform
    { x: 18, y: 6, width: 4, height: 1, type: "platform" }, //platform
    { x: 20, y: 28, width: 4, height: 1, type: "platform" }, //platform
    { x: 16, y: 22, width: 4, height: 1, type: "platform" }, //platform
    { x: 4, y: 5, width: 4, height: 1, type: "platform" }, //platform
    { x: 4, y: 10, width: 1, height: 4, type: "platform" }, //wall
    { x: 18, y: 6, width: 1, height: 2, type: "platform" }, //wall
    { x: 22, y: 6, width: 1, height: 2, type: "platform" }, //wall
    { x: 26, y: 8, width: 1, height: 6, type: "platform" }, //wall
    // { x: 700, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    // { x: 80, y: 5 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    // { x: 505, y: 3 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "gold", type: "goal" },  //goal
    { x: 80, y: 5 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 750, y: 4 / 10 * CANVAS.y + 25, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 80, y: 100, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 160, y: 32, width: 20, height: 20, color: "red", type: "baddy" },  //baddy
    { x: 0, y: 25, width: LEVEL.x, height: 7, color: "#60ff30", type: "grass" }, //grass
]