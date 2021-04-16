const numObjects = 50;
auto = true;

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
const reindex = () => {
  for(let i = 0; i < things.length; i++) things[i].i = i;
}
/** Distance between 2 points. */
const distance = (a, b) => {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}
/** Agngle between 2 points (radians). */
const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
/** Simple gravitational attraction calculation. */
const attraction = (a, b, d) => (a.mass * b.mass) / (d * d);
/** Vector to point. */
const vToP = (ang, mag) => ({
  x: mag * Math.cos(ang),
  y: mag * Math.sin(ang)
});

const calcG = a => things.reduce((g, b) => {
  if (a !== b) { // exclude itself
    const dist = distance(a, b);
    const attr = attraction(a, b, dist);
    const pt = vToP(angle(a, b), attr);
    g.x += pt.x;
    g.y += pt.y;
    if (g.nearest.thing == null || g.nearest.dist > dist) {
      g.nearest.thing = b;
      g.nearest.dist = dist;
      g.nearest.attr = attr;
    }
  }
  return g;
}, {
  x:0,
  y:0,
  nearest: {
    thing: null,
    dist: 0,
    attr: 0
  }
});

let collisions = [];
const update = () => {
  // handle collisions
  for (let i = 0; i < collisions.length; i++) {
    let a = collisions[i].a;
    let b = collisions[i].b;

    a.mass += b.mass;
    let pos = vToP(angle(a, b), distance(a, b));
    a.x += pos.x / 2;
    a.y += pos.y / 2;
    a.v.x = ((a.v.x * a.mass) + (b.v.x * b.mass)) / a.mass;
    a.v.y = ((a.v.y * a.mass) + (b.v.y * b.mass)) / a.mass;
    things.splice(b.i, 1);
    reindex();
  }
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
  collisions = things.reduce((coll, thing) => {
    thing.g = calcG(thing);
    if (thing.g.nearest.thing && thing.g.nearest.attr > thing.g.nearest.dist * 10) {
      if (!coll.find(c => c.a === thing || c.b === thing))
        coll.push({ a: thing, b: thing.g.nearest.thing});
    }
    else {
      thing.v.x += thing.g.x / 100;
      thing.v.y += thing.g.y / 100;
    }
    return coll;
  }, []);
  requestAnimationFrame(render);
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




// make some stuff
let things = [];
for(let i = 0; i < numObjects; i++) things.push(mass(i));
update();
if (auto) setInterval(update, 10);
else document.body.addEventListener('keypress', e => update());