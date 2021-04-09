let canvasWidth,
    canvasHeight,
    minMaxX,
    minMaxY;

const canvas = document.body.appendChild(document.createElement('canvas'));
const ctx = canvas.getContext('2d');
const resize = () => {
  // decrease the size to prevent scroll bars
  canvasWidth = window.innerWidth - 2;
  canvasHeight = window.innerHeight - 4;
  minMaxX = canvasWidth / 2;
  minMaxY = canvasHeight / 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.resetTransform();
  ctx.translate(Math.floor(minMaxX) - 1, Math.floor(minMaxY) - 1);
  ctx.scale(1, -1);
}
window.onresize = resize;
resize();




/** Random mass generator. */
const mass = () => ({
  x: canvasWidth / 2 - Math.random() * canvasWidth,
  y: canvasHeight / 2 - Math.random() * canvasHeight,
  mass: Math.random() * 100,
  angle: 0,
  velocity: 0
  // angle: Math.random() * 2 * Math.PI,
  // velocity: Math.random() * 5
});
const distance = (a, b) => {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}
const angle = (a, b) => Math.atan2(b.y - a.y, b.x - b.x);
const attraction = (a, b) => {
  const d = distance(a, b);
  return (a.mass * b.mass) / (d * d);
}
const vToP = (ang, mag) => ({
  x: mag * Math.cos(ang),
  y: mag * Math.cos(ang)
});


const calcG = m => things.reduce((g, t) => {
  if (t !== m) { // exclude itself
    const v = vToP(angle(m, t), attraction(m, t));
    g.x += v.x;
    g.y += v.y;
  }
  return g;
}, { x:0, y:0 });




const render = () => {
  ctx.fillStyle = '#333';
  ctx.fillRect(minMaxX * -1, minMaxY * -1, minMaxX * 2, minMaxY * 2);

  let g;
  ctx.strokeStyle = '#fff';
  for(let i = 0; i < things.length; i++) {
    ctx.beginPath();
    ctx.arc(things[i].x, things[i].y, Math.floor(things[i].mass / 10), 0, Math.PI * 2, true);
    ctx.stroke();

    g = calcG(things[i]);
    ctx.beginPath();
    ctx.moveTo(things[i].x, things[i].y);
    ctx.lineTo(things[i].x + g.x, things[i].y + g.y);
    ctx.stroke();
  }

  // test calculations
  ctx.strokeStyle = '#f00';
  for(let i = 0; i < testObs.length; i++) {
    ctx.beginPath();
    ctx.arc(testObs[i].x, testObs[i].y, Math.floor(testObs[i].mass / 10), 0, Math.PI * 2, true);
    ctx.stroke();

    g = calcG(testObs[i]);
    ctx.beginPath();
    ctx.moveTo(testObs[i].x, testObs[i].y);
    ctx.lineTo(testObs[i].x + g.x, testObs[i].y + g.y);
    ctx.stroke();
  }
  // ctx.beginPath();
  // ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
  // ctx.stroke();

  // let oi = vToP(Math.PI, 20);
  // ctx.beginPath();
  // ctx.moveTo(0,0);
  // ctx.lineTo(oi.x, oi.y);
  // ctx.stroke();
}





// test objects
const testObs = [
  {
    x: 0,
    y: 0,
    mass: 50
  },
  {
    x: 20,
    y: 20,
    mass: 50
  }
]


// make some stuff
const numObjects = 5;
let things = [];
for(let i = 0; i < numObjects; i++) things.push(mass());
render();