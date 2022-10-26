class Platform extends Object {
    constructor(gridX, gridY, gridW, gridH) {
        super(gridX * 25, gridY * 25, gridW * 25, gridH * 25)
        this.Frame = "brown";
    }

    getFrame = () => this.Frame 
}