class Matrix {
  /*
  Format:
  [[col], [col], [col]]

  Meaning

  mat[col][row]

  Example 1:
  [[1, 2, 3]]
  1
  2
  3

  Example 2:
  [[1, 2], [3, 4], [5, 6]]
  1 3 5
  2 4 6
  */
  constructor(mat = [[0]]) {
    this.mat = JSON.parse(JSON.stringify(mat));

    this.col = this.mat.length;
    this.row = this.mat[0].length;

    for (let i = 1; i < this.col; i++) {
      if (this.mat[0].length != this.mat[i].length) {
        alert('Invalid matrix at constructor');

        break;
      }
    }
  }

  createMat(col, row) {
    this.mat = [];
    this.col = col;
    this.row = row;

    for (let i = 0; i < this.col; i++) {
      let rowArr = [];
      for (let j = 0; j < this.row; j++) {
        rowArr.push(0);
      }
      this.mat.push(rowArr);
    }
  }

  copy(other) {
    this.mat = JSON.parse(JSON.stringify(other.mat));

    this.col = this.mat.length;
    this.row = this.mat[0].length;

    for (let i = 1; i < this.col; i++) {
      if (this.mat[0].length != this.mat[i].length) {
        alert('Invalid matrix at copy');

        break;
      }
    }
  }

  mult(lhs) {
    if (this.col != lhs.row) return false; // invalid multiplication

    const newCol = lhs.col;
    const newRow = this.row;
    let newMat = [];
    for (let i = 0; i < newCol; i++) {
      let rowArr = [];
      for (let j = 0; j < newRow; j++) {
        rowArr.push(0);
      }
      newMat.push(rowArr);
    }

    for (let i = 0; i < lhs.col; i++) {
      for (let j = 0; j < this.row; j++) {
        let total = 0;

        for (let k = 0; k < lhs.row; k++) {
          total += this.mat[k][j] * lhs.mat[i][k];
        }

        newMat[i][j] = total;
      }
    }

    this.mat = JSON.parse(JSON.stringify(newMat));
    this.col = newCol;

    return true;
  }

  transpose() {
    let newMat = new Matrix();
    newMat.createMat(this.row, this.col);

    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        newMat.mat[j][i] = this.mat[i][j];
      }
    }

    this.copy(newMat);
  }

  det2x2() {
    if (this.col === 2 && this.row === 2) {
      return (this.mat[0][0] * this.mat[1][1]) - (this.mat[1][0] * this.mat[0][1]);
    }
  }

  det3x3() {
    if (this.col === 3 && this.row === 3) {
      return (this.mat[0][0] * this.mat[1][1] * this.mat[2][2]) +
        (this.mat[1][0] * this.mat[2][1] * this.mat[0][2]) +
        (this.mat[2][0] * this.mat[0][1] * this.mat[1][2]) -

        (this.mat[0][0] * this.mat[2][1] * this.mat[1][2]) -
        (this.mat[1][0] * this.mat[0][1] * this.mat[2][2]) -
        (this.mat[2][0] * this.mat[1][1] * this.mat[0][2]);
    }
  }

  cofactor3x3() {
    if (this.col === 3 && this.row === 3) {
      // find cofactor
      let cofactor = new Matrix();
      cofactor.createMat(3, 3);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let colMin, colMax;
          let rowMin, rowMax;

          colMax = i <= 1 ? 2 : 1;
          colMin = i >= 1 ? 0 : 1;

          rowMax = j <= 1 ? 2 : 1;
          rowMin = j >= 1 ? 0 : 1;

          const detMat = new Matrix([
            [this.mat[colMin][rowMin], this.mat[colMin][rowMax]],
            [this.mat[colMax][rowMin], this.mat[colMax][rowMax]]
          ]);

          cofactor.mat[i][j] = detMat.det2x2() * Math.pow(-1, i + j + 2);
        }
      }

      this.copy(cofactor);
    }
  }

  scalar(s) {
    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        this.mat[i][j] *= s;
      }
    }
  }

  invert3x3() {
    // https://www.cuemath.com/algebra/inverse-of-3x3-matrix/
    if (this.col === 3 && this.row === 3) {
      // find cofactor
      let adjoint = new Matrix(this.mat);

      adjoint.cofactor3x3();
      adjoint.transpose();
      // console.log(adjoint);

      const det = this.det3x3();

      if (det === 0) return;
      // console.log(det);

      adjoint.scalar(1 / det);
      // console.log(adjoint);

      this.copy(adjoint);
    }
  }

  pow(p) {
    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        this.mat[i][j] = Math.pow(this.mat[i][j], p);
      }
    }
  }
  cbrt() {
    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        this.mat[i][j] = Math.cbrt(this.mat[i][j]);
      }
    }
  }

  static Arr3ToMat(a) {
    return new Matrix([[a[0], a[1], a[2]]]);
  }
  static MatToArr3(m) {
    return [m.mat[0][0], m.mat[0][1], m.mat[0][2]];
  }
}