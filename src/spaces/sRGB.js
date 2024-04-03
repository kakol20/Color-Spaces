const sRGB = (function() {
    return {
        mix(c1, c2, t) {
            return lerpColor(c1, c2, t);
        }
    }
})();