let canvasWidth,
    canvasHeight;
const minMaxX = 1000;
const minMaxY = 1000;

const canvas = document.body.appendChild(document.createElement('canvas'));
const ctx = canvas.getContext('2d');
const resize = () => {
  // decrease the size to prevent scroll bars
  canvasWidth = window.innerWidth - 2;
  canvasHeight = window.innerHeight - 4;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const scale = canvasWidth > canvasHeight ?
    canvasWidth / minMaxX * 1.5 :
    canvasHeight / minMaxY * 1.5;

  ctx.resetTransform();
  ctx.translate(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2));
  ctx.scale(scale, scale * -1);
}
resize();



//ctx.fillStyle = '#333';
ctx.font = '10px sans-serif';
const render = (things, time) => {
  ctx.fillStyle = '#333';
  ctx.fillRect(minMaxX * -1, minMaxY * -1, minMaxX * 2, minMaxY * 2);

  let g;
  //ctx.strokeStyle = '#fff';
  for(let i = 0; i < things.length; i++) {

    if (things[i].mass < 1000) ctx.strokeStyle = '#fff';
    else if (things[i].mass < 2000) ctx.strokeStyle = '#ff0';
    else ctx.strokeStyle = '#f00';
    ctx.beginPath();
    ctx.arc(things[i].x, things[i].y, Math.floor(things[i].mass / 10), 0, Math.PI * 2, true);
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(things[i].x, things[i].y);
    // ctx.lineTo(things[i].x + things[i].g.x, things[i].y + things[i].g.y);
    // ctx.stroke();

    ctx.strokeStyle = '#ff0';
    ctx.beginPath();
    ctx.moveTo(things[i].x, things[i].y);
    ctx.lineTo(things[i].x + things[i].v.x, things[i].y + things[i].v.y);
    ctx.stroke();

    // Axis
    // ctx.beginPath();
    // ctx.moveTo(-1000, 0);
    // ctx.lineTo(1000, 0);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(0, -1000);
    // ctx.lineTo(0, 1000);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(-100, -100);
    // ctx.lineTo(-100, 100);
    // ctx.lineTo(100, 100);
    // ctx.lineTo(100, -100);
    // ctx.lineTo(-100, -100);
    // ctx.stroke();

    // Indexes
    // ctx.fillStyle = '#ff0';
    // ctx.fillText(i, things[i].x, things[i].y);

    if (time) {
      // text is upside down due to scaling
      ctx.fillStyle = '#ff0';
      ctx.fillText(time, 0, 0);
    }
  }
}

const worker = new Worker('worker.js');
worker.onmessage = e => {
  requestAnimationFrame(() => render(e.data.things, e.data.time));
}
worker.postMessage({ params: { minMaxX, minMaxY } });











// NOT USED
/** Blow stuff up if it gets too heavy. */
const explode = thing => {
  let mass = thing.mass;
  let part = 0;
  let masses = [];
  while(part < mass) {
    part = Math.random() * .35 * thing.mass;
    masses.push(part);
    mass -= part;
  }
  const angleInc = Math.PI * 2 / masses.length;
  let nextAngle = angleInc;
  for(let i = 0; i < masses.length; i++) {
    const exMove = vToP(nextAngle, 10);
    nextAngle += angleInc;
    things.push({
      i: 0,
      x: thing.x,
      y: thing.y,
      mass: masses[i],
      v: { x: exMove.x + thing.v.x, y: exMove.y + thing.v.y },
      g: { x: 0, y: 0 }
    });
  }
}
