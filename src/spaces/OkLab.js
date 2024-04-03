const OkLab = (function() {
    // https://bottosson.github.io/posts/oklab/
    const M1 = new Matrix([
        [0.8189330101, 0.0329845436, 0.0482003018],
        [0.3618667424, 0.9293118715, 0.2643662691],
        [-0.128859713, 0.0361456387, 0.6338517070]
    ]);
    const M2 = new Matrix([
        [0.2104542553, 1.9779984951, 0.0259040371],
        [0.7936177850, -2.4285922050, 0.7827717662],
        [-0.0040720468, 0.4505937099, -0.8086757660]
    ]);

    const M1inv = new Matrix(M1.mat);
    const M2inv = new Matrix(M2.mat);

    M1inv.invert3x3();
    M2inv.invert3x3();

    return {

    }
})();