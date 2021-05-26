/*
  This is the worker script.  It calculates all the g-forces and moves
  objects around in space.  It also determines collisions between objects.
  This posts an updated array of Things back to the UI thread for 
  each frame.
*/

import '../types.js';
import p from './physics.js';


/**
 * Milliseconds between frames.
 * @type {number}
 */
const targetFrameInterval = 33;
/**
 * Inital number of objects.
 * @type {number}
 */
let numObjects;
/**
 * Minimum/maximum values for x.
 * @type {number}
 */
let minMaxX;
/**
 * Minimum/maximum values for y.
 * @type {number}
 */
let minMaxY;

/** 
 * Functions to cause objects to disappear off one 
 * bound and appear on the opposite.
 */
let wrapX, wrapY;


/** Holds things that will collide on the next update. */
let collisions = [];
/** Will be true if we're in the middle of an update. */
let updating = false;


/**
 * Removes objects that have collided with other objects, updates
 * item positions and velocity, and identifies collisions for the
 * next round.
 * 
 * Though this returns an array of objects, it is not a pure function.
 * @param {Thing[]} things 
 * @returns {Thing[]}
 */
const update = things => {
  // TODO: This doesn't seem to work, but I don't know why yet.
  if (updating) {
    console.log('[dropped frame]');
    return;
  }
  updating = true;
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
    // TODO: Find out if the following statement true?
    a.coll = b; // put the collision here, it will be discarded next round
    things.splice(things.indexOf(b), 1);
  }
  // move objects
  for(let i = 0; i < things.length; i++) {
    things[i].x = wrapX(things[i].x + things[i].v.x);
    things[i].y = wrapY(things[i].y + things[i].v.y);
  }
  // calculate collisions (for the next round)
  const gForce = p.calcG(things, minMaxX, minMaxY);
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

  updating = false;
  return things;
}


/**
 * Starts the worker.
 * > ### NOTE:
 * > As it stands right now, if you pause execution of the
 * > main thread this will keep running.  So when you resume
 * > the animation will jump many frames ahead.
 * @returns {WorkerControls}
 */
const play = () => {
  let things = [];
  for(let i = 0; i < numObjects; i++) things.push(p.mass(minMaxX, minMaxY));

  let interval = null;
  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  const resume = () => {
    // @ts-ignore (this is worker.postMessage, not window.postMessage)
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
    wrapX = p.wrap(minMaxX);
    wrapY = p.wrap(minMaxY);
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