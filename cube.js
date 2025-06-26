
class Cube {
  constructor() {
    this.reset();
  }

  reset() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('g'),
      B: Array(9).fill('b'),
      L: Array(9).fill('o'),
      R: Array(9).fill('r'),
    };
  }

  rotateFace(face, clockwise = true) {
    const f = this.faces[face];
    const rotated = clockwise
      ? [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]]
      : [f[2], f[5], f[8], f[1], f[4], f[7], f[0], f[3], f[6]];
    this.faces[face] = rotated;
    this._rotateSides(face, clockwise);
  }

  _rotateSides(face, clockwise) {
    const map = {
      U: [['B', 0,1,2], ['R', 0,1,2], ['F', 0,1,2], ['L', 0,1,2]],
      D: [['F', 6,7,8], ['R', 6,7,8], ['B', 6,7,8], ['L', 6,7,8]],
      F: [['U', 6,7,8], ['R', 0,3,6], ['D', 2,1,0], ['L', 8,5,2]],
      B: [['U', 2,1,0], ['L', 0,3,6], ['D', 6,7,8], ['R', 8,5,2]],
      L: [['U', 0,3,6], ['F', 0,3,6], ['D', 0,3,6], ['B', 8,5,2]],
      R: [['U', 8,5,2], ['B', 0,3,6], ['D', 8,5,2], ['F', 8,5,2]]
    };

    const indices = map[face];
    const copy = indices.map(([f, ...idxs]) => idxs.map(i => this.faces[f][i]));

    if (!clockwise) copy.unshift(copy.pop());
    else copy.push(copy.shift());

    for (let i = 0; i < 4; i++) {
      const [f, ...idxs] = indices[i];
      idxs.forEach((idx, j) => this.faces[f][idx] = copy[i][j]);
    }
  }

  getColorString() {
    return ['U','R','F','D','L','B'].map(f => this.faces[f].join('')).join('');
  }
}

const cube = new Cube();
const stepsDisplay = document.getElementById("steps");
const cubeSvg = document.getElementById("cube-svg");

function scrambleCube() {
  const moves = ['U', 'D', 'F', 'B', 'L', 'R'];
  let scramble = [];
  for (let i = 0; i < 20; i++) {
    const move = moves[Math.floor(Math.random() * 6)];
    cube.rotateFace(move);
    scramble.push(move);
  }
  render("Scrambled with: " + scramble.join(" "));
}

function solveCube() {
  let steps = [];
  const dummyMoves = ['R', 'U', 'R', 'U', 'R', 'U']; // Dummy repetitive steps

  for (let move of dummyMoves) {
    cube.rotateFace(move);
    steps.push(move);
    render("Step: " + move, true);
  }

  render("Dummy Solve Complete:\n" + steps.join(" → "));
}

function render(log, keep = false) {
  if (!keep) stepsDisplay.textContent = "";
  stepsDisplay.textContent += log + "\n";
  cubeSvg.innerHTML = getCubeSvg(cube.getColorString());
}

// Dummy method for rendering (You should replace with actual implementation provided)
function getCubeSvg(colorString) {
  return `<pre style="font-size:12px">${colorString}</pre>`;
}
