/** Milliseconds between frames. */
const targetFrameInterval = 33;
/** Inital number of objects. */
let numObjects;
/** Minimum/maximum values for x. */
let minMaxX;
/** Minimum/maximum values for y. */
let minMaxY;


/** Random mass generator. */
const mass = (i) => ({
  id: Math.random().toString(36).substring(7),
  x: Math.random() * minMaxX * 2 - minMaxX,
  y: Math.random() * minMaxY * 2 - minMaxY,
  mass: Math.random() * 50,
  v: { x: 0, y: 0 },
  g: { x: 0, y: 0 }
});
/** degrees to radians */
const dtor = d => d * Math.PI / 180;
/** radians to degrees */
const rtod = r => r * 180 / Math.PI;
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
/** Roughly calculates the G-force on one object. */
const calcG = things => a => things.reduce((g, b) => {
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
  },
  coll: null
});



let collisions = [];
let updating = false;
const update = things => {
  if (updating) {
    console.log('[dropped frame]');
    return;
  }
  updating = true;
  let start = performance.now();
  // handle collisions
  for (let i = 0; i < collisions.length; i++) {
    let a = collisions[i].a;
    let b = collisions[i].b;

    if (a.mass < b.mass) {
      a.x = b.x;
      a.y = b.y;
    }

    let ratio = a.mass / b.mass;
    let am = ratio > 1 ? 1 - (1 / ratio) : ratio;
    let bm = ratio > 1 ? 1 / ratio : 1 - ratio;
    a.v.x = (a.v.x * am) + (b.v.x * bm);
    a.v.y = (a.v.y * am) + (b.v.y * bm);

    a.mass += b.mass;
    a.coll = b; // put the collision here, it will be discarded next round
    things.splice(things.indexOf(b), 1);
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
  // calculate collisions (for the next round)
  const gForce = calcG(things);
  collisions = things.reduce((coll, thing) => {
    thing.g = gForce(thing);
    if (
      thing.g.nearest.thing && (
        thing.g.nearest.dist < 4 ||
        thing.g.nearest.attr > thing.g.nearest.dist * 40
      )) {
      if (!coll.find(c => c.a === thing || c.b === thing))
        coll.push({ a: thing, b: thing.g.nearest.thing});
    }
    else {
      thing.v.x += thing.g.x / (thing.mass * 10);
      thing.v.y += thing.g.y / (thing.mass * 10);
    }
    return coll;
  }, []);

  let time = performance.now() - start;
  updating = false;
  return { things, time };
}


/**
 * ## NOTE:
 * As it stands right now, if you pause execution of the
 * main thread this will keep running.  So when you resume
 * the animation will jump many frames ahead.
 */
const play = () => {
  let things = [];
  for(let i = 0; i < numObjects; i++) things.push(mass(i));

  let interval = null;
  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  const resume = () => {
    interval = setInterval(() => postMessage(update(things)), targetFrameInterval);
  }
  resume();
  return { stop, resume }
}


let control;
onmessage = e => {
  if (e.data.params) {
    minMaxX = e.data.params.minMaxX;
    minMaxY = e.data.params.minMaxY;
    numObjects = e.data.params.numObjects;
    control = play();
  }
  if (e.data.cmd && control) {
    if (e.data.cmd === 'stop') control.stop();
    if (e.data.cmd === 'resume') control.resume();
    if (e.data.cmd === 'restart') {
      control.stop();
      control = play();
    }
  }
}