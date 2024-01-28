class vector2 {
    X : number;
    Y : number;

    constructor (X : number, Y : number) {
        this.X = X;
        this.Y = Y;
    }

    magnitude () : number {
        return Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2));
    }

    unit () : vector2 {
        const magnitude = this.magnitude();
        if (magnitude == 0) return new vector2(0, 0);

        return new vector2(this.X / magnitude, this.Y / magnitude);
    }
}