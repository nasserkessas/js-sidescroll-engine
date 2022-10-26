class Object {

    constructor(x, y, width, height) {
        this.Width = width;
        this.Height = height;
        this.Left = x;
        this.Top = y + height;
        this.Bottom = y;
        this.Right = x + width;
        this.ID = getID();
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
        }
    }
}