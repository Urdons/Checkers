var vector2 = (function () {
    function vector2(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    vector2.prototype.magnitude = function () {
        return Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2));
    };
    vector2.prototype.unit = function () {
        var magnitude = this.magnitude();
        if (magnitude == 0)
            return new vector2(0, 0);
        return new vector2(this.X / magnitude, this.Y / magnitude);
    };
    return vector2;
}());
