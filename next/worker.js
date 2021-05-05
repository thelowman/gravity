const dtor = d => d * Math.PI / 180;
const rtod = r => r * 180 / Math.PI;
/** sine lookup */
let sine = [];
for(let i = 0; i < 361; i++) sine.push(Math.sin(dtor(i)));
/** cosine lookup */
let cosine = [];
for(let i = 0; i < 361; i++) cosine.push(Math.cos(dtor(i)));
/** atan2 lookup */


/** Random mass generator. */
const mass = (i) => ({
  i,
  x: Math.random() * minMaxX * 2 - minMaxX,
  y: Math.random() * minMaxY * 2 - minMaxY,
  mass: Math.random() * 50, //100,
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
  // x: ang > 0 ? mag * cosine[Math.round(rtod(ang))] : mag * cosine[Math.round(360 + rtod(ang))],
  // y: ang > 0 ? mag * sine[Math.round(rtod(ang))] : mag * sine[Math.round(360 + rtod(ang))]
});


/** Roughly calculates the G-force on one object. */
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
let longestDuration = 0;
const update = () => {
  let start = performance.now();
  // handle collisions
  for (let i = 0; i < collisions.length; i++) {
    let a = collisions[i].a;
    let b = collisions[i].b;

    // let pos = vToP(angle(a, b), distance(a, b));
    if (a.mass < b.mass) {
      a.x = b.x;
      a.y = b.y;
    }
    // a.x += pos.x / 2;
    // a.y += pos.y / 2;

    let ratio = a.mass / b.mass;
    let am = ratio > 1 ? 1 - (1 / ratio) : ratio;
    let bm = ratio > 1 ? 1 / ratio : 1 - ratio;
    a.v.x = (a.v.x * am) + (b.v.x * bm);
    a.v.y = (a.v.y * am) + (b.v.y * bm);

    a.mass += b.mass;
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
  // // this version prevents collisions
  // for(let i = 0; i < things.length; i++) {
  //   things[i].g = calcG(things[i]);
  //   things[i].v.x += things[i].g.x / (things[i].mass * 10);
  //   things[i].v.y += things[i].g.y / (things[i].mass * 10);
  // }
  // this version produces collisions
  collisions = things.reduce((coll, thing) => {
    thing.g = calcG(thing);
    if (thing.g.nearest.thing && thing.g.nearest.attr > thing.g.nearest.dist * 10) {
      if (!coll.find(c => c.a === thing || c.b === thing))
        coll.push({ a: thing, b: thing.g.nearest.thing});
    }
    else {
      thing.v.x += thing.g.x / (thing.mass * 10);
      thing.v.y += thing.g.y / (thing.mass * 10);
    }
    return coll;
  }, []);

  let tmp = performance.now() - start;
  if (tmp > longestDuration) longestDuration = tmp;
  postMessage({
    things,
    time: tmp //performance.now() - start
  });
}


let things = [];
let minMaxX, minMaxY;
setInterval(update, 33);

onmessage = e => {
  minMaxX = e.data.minMaxX;
  minMaxY = e.data.minMaxY;
  for(let i = 0; i < e.data.things; i++) things.push(mass(i));
  update();
}