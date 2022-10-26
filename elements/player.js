class Player extends MovingObject {

    constructor(x, y) {
        let Frames = {
            idle: ["black"],
            walking: ["yellow", "orange", "gold"],
            running: ["orangered", "red", "darkred"],
            jumping: ["green", "blue", "cyan"],
            falling: ["purple"],
        }
        let State = { state: "falling", frame: 1 }
        super(x, y, 20, 20, Frames, State);
        this.Top = y + this.Height;
        this.Left = x;
        this.Bottom = y;
        this.Right = x + this.Width;
        this.jumpKey = false;
        this.moving = false;
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

        this.getBounds([...baddies, ...platforms]) // this.getBounds([...objects, ...baddies, ...platforms])
        if (this.Right + x > this.Bounds.right.loc) x = this.Bounds.right.loc - this.Right;
        if (this.Left + x < this.Bounds.left.loc) x = this.Bounds.left.loc - this.Left;

        if (!this.airborne()) {
            this.SpeedX === 1.5 ? this.updateState("running") : this.updateState("walking")
        }
        this.moving = true;
        this.coords(this.Left + x, this.Top);
    }

    airborne = () => this.Bottom > this.Bounds.bottom.loc;

    goingUp = () => this.SpeedY > 0 ? true : false

    noJump = () => this.jumpKey = false;

    jump = () => {

        let doJump = false;

        if (this.JumpBoost > 0) {
            this.JumpBoost += GRAVITY;
            this.SpeedY -= GRAVITY;
        }

        if (!this.jumpKey && this.airborne()) { // wall jump

            if (this.Left === this.Bounds.left.loc) {
                if (this.lastJumpedObj != this.Bounds.left.obj.ID) doJump = true;
                // this.move(RIGHT);
                this.lastJumpedObj = this.Bounds.left.obj.ID;

            }
            if (this.Right === this.Bounds.right.loc) {
                if (this.lastJumpedObj != this.Bounds.right.obj.ID) doJump = true;
                // this.move(LEFT);
                this.lastJumpedObj = this.Bounds.right.obj.ID;
            }

        }

        this.jumpKey = true;

        if (this.Bottom === this.Bounds.bottom.loc) doJump = true;

        if (doJump) {
            this.JumpBoost = JUMPHEIGHT * 2;
            this.SpeedY = JUMPHEIGHT;
            this.coords(this.Left, this.Top + 1)
        }
    }

    update = () => {

        this.getBounds([...baddies, ...platforms]) // this.getBounds([...objects, ...baddies, ...platforms])

        if (this.airborne()) {

            this.updateState("jumping")

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
                this.lastJumpedObj = null;
            }
        } else {
            if (!this.moving) {
                this.updateState("idle");
            }
        }
        this.moving = false;
    }
}