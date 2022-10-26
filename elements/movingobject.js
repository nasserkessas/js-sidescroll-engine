class MovingObject extends Object {

    constructor(x, y, w, h, frames, state, type) {
        super(x, y, w, h);
        this.SpeedY = 0;
        this.SpeedX = 1;
        this.JumpBoost = 0;
        this.Frames = frames;
        this.State = state;
        this.Type = type;
    }

    getBounds = (objs) => {
        let b = { top: { loc: LEVEL.y, obj: { Type: "canvas", ID: "top" } }, right: { loc: LEVEL.x, obj: { ID: "right", Type: "canvas" } }, bottom: { loc: 0, obj: { ID: "bottom", Type: "canvas" } }, left: { loc: 0, obj: { ID: "left", Type: "canvas" } } };

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


    updateState = (state) => {
        if (state === this.State.state) {
            if (this.Frames[this.State.state].length === this.State.frame) {
                this.State.frame = 1;
            } else this.State.frame++;
        } else {
            this.State.state = state;
            this.State.frame = 1;
        }
    }


    run = () => { this.SpeedX = 1.5; this.updateState("running") }

    walk = () => { this.SpeedX = 1; this.updateState("walking") }

    stop = () => { this.SpeedX = 1; this.updateState("idle"); }

    getFrame = () => this.Frames[this.State.state][this.State.frame - 1]

}