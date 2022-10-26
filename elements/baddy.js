class Baddy extends MovingObject {

    constructor(x, y, w, h, type) {
        let Frames = {
            walking: ["yellow", "orange", "red", "orangered"],
            falling: ["purple"],
        }
        let State = { state: "walking", frame: 1 }

        super(x, y, w, h, Frames, State, type);
        this.Top = y + this.Height;
        this.Left = x;
        this.Bottom = y;
        this.Right = x + this.Width;
        this.Direction = Math.round(Math.random()); // 1 or 0
        this.Speed = 1;
        this.Type = type;
    }

    update = () => {
        this.updateState("walking")

        this.getBounds([...baddies, ...platforms]) // this.getBounds([player, ...objects, ...baddies]);
        if (this.Direction === LEFT) {
            if (this.Bounds.left.loc >= this.Left) {
                this.Direction = RIGHT;
                return;
            }

            this.coords(this.Left - this.Speed, this.Top);
        }
        if (this.Direction === RIGHT) {
            if (this.Bounds.right.loc <= this.Right) {
                this.Direction = LEFT;
                return;
            }

            this.coords(this.Left + this.Speed, this.Top);
        }
    }
}