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
  minMaxX = canvasWidth / 2 + 1;
  minMaxY = canvasHeight / 2 + 1;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.resetTransform();
  ctx.translate(Math.floor(minMaxX) - 1, Math.floor(minMaxY) - 1);
  ctx.scale(1, -1);
}
window.onresize = resize;
resize();





/** Random mass generator. */
const mass = (i) => ({
  i,
  x: canvasWidth / 2 - Math.random() * canvasWidth,
  y: canvasHeight / 2 - Math.random() * canvasHeight,
  mass: Math.random() * 100,
  v: { x: 0, y: 0 },
  g: { x: 0, y: 0 }
});
const distance = (a, b) => {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}
const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const attraction = (a, b) => {
  const d = distance(a, b);
  return { d, f: (a.mass * b.mass) / (d * d) }
}
const vToP = (ang, mag) => ({
  x: mag * Math.cos(ang),
  y: mag * Math.sin(ang)
});


const calcG = m => things.reduce((g, t) => {
  if (t !== m) { // exclude itself
    const a = attraction(m, t);
    const v = vToP(angle(m, t), a.f);

    g.x += v.x;
    g.y += v.y;
  }
  return g;
}, { x:0, y:0 });


let collisions = [];
const update = () => {
  // handle collisions
  // move objects
  for(let i = 0; i < things.length; i++) {
    things[i].x += things[i].v.x;
    things[i].y += things[i].v.y;
    if (things[i].x > minMaxX) things[i].x = things[i].x + minMaxX * -2;
    if (things[i].x < minMaxX * -1) things[i].x = things[i].x + minMaxX * 2;
    if (things[i].y > minMaxY) things[i].y = things[i].y + minMaxY * -2;
    if (things[i].y < minMaxY * -1) things[i].y = things[i].y + minMaxY * 2;
  }
  // prepare for the next round
  collisions = [];
  for(let i = 0; i < things.length; i++) {
    things[i].g = calcG(things[i]);
    things[i].v.x += things[i].g.x / 100;
    things[i].v.y += things[i].g.y / 100;
  }
  console.log(collisions);
}


//ctx.fillStyle = '#333';
ctx.font = '14px sans-serif';
const render = () => {
  ctx.fillStyle = '#333';
  ctx.fillRect(minMaxX * -1, minMaxY * -1, minMaxX * 2, minMaxY * 2);

  let g;
  //ctx.strokeStyle = '#fff';
  for(let i = 0; i < things.length; i++) {
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.arc(things[i].x, things[i].y, Math.floor(things[i].mass / 10), 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(things[i].x, things[i].y);
    ctx.lineTo(things[i].x + things[i].g.x, things[i].y + things[i].g.y);
    ctx.stroke();

    ctx.strokeStyle = '#ff0';
    ctx.beginPath();
    ctx.moveTo(things[i].x, things[i].y);
    ctx.lineTo(things[i].x + things[i].v.x, things[i].y + things[i].v.y);
    ctx.stroke();

    ctx.fillStyle = '#ff0';
    ctx.fillText(i, things[i].x, things[i].y);
  }
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
    y: 0,
    mass: 50
  }
]


// make some stuff
const numObjects = 50;
let things = [];
for(let i = 0; i < numObjects; i++) things.push(mass(i));
update();
render();
document.body.addEventListener('keypress', e => {
  update();
  render();
});
