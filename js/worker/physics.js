/*
  Stores our physics calculations.
*/

import '../types.js';

/**
 * Generates a random Thing.
 * @param {number} minMaxX Max x value (positive or negative).
 * @param {number} minMaxY Max y value (positive or negative).
 * @returns Thing
 */
const mass = (minMaxX, minMaxY) => ({
  id: Math.random().toString(36).substring(7),
  x: Math.random() * minMaxX * 2 - minMaxX,
  y: Math.random() * minMaxY * 2 - minMaxY,
  mass: Math.random() * 50,
  v: { x: 0, y: 0 },
  g: { x: 0, y: 0 }
});


/** 
 * Degrees to radians.
 * Not called, just used for debugging.
 * @param {number} d Angle in degrees.
 */
const dtor = d => d * Math.PI / 180;


/**
 * Radians to degrees.
 * Not called, just used for debugging.
 * @param {number} r Angle in radians.
 */
const rtod = r => r * 180 / Math.PI;


/**
 * Distance between 2 points.
 * @param {Point | Thing} a
 * @param {Point | Thing} b
 * @returns {number}
 */
const distance = (a, b) => {
  let dx = b.x - a.x;
  let dy = b.y - a.y;  
  return Math.sqrt((dx * dx) + (dy * dy));
}


/**
 * Agngle between 2 points (radians).
 * @param {Point | Thing} a
 * @param {Point | Thing} b
 * @returns {number} The angle in radians.
 */
const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);


/**
 * Simple gravitational attraction calculation.
 * @param {Thing} a
 * @param {Thing} b
 * @param {number} d Distance as a param so we don't have to calculate it again.
 * @returns {number} A value representing the g-force.
 */
const attraction = (a, b, d) => (a.mass * b.mass) / (d * d);


/**
 * Vector to point. Converts a vector to a point.
 * @param {number} ang The vector's angle.
 * @param {number} mag The vector's value (magnitude).
 */
const vToP = (ang, mag) => ({
  x: mag * Math.cos(ang),
  y: mag * Math.sin(ang)
});


/**
 * Checks a single coordinate value (either x or y) and translates it
 * to the opposite side of the boundary if it is out of bounds, causing
 * the object to "wrap" around the universe.
 * @param {number} minMax Maximum positive or negative value.
 * @returns {(number) => number} Function to calculate the new coordinate.
 */
const wrap = minMax => xy => 
  Math.abs(xy) > minMax ? xy > 0 ? xy - minMax * 2 : xy + minMax * 2 : xy;


/**
 * Roughly calculates the G-force on one object.
 * @param {Thing[]} things 
 * @returns {(Thing) => GForce} Function to calculate the G-Force on an object.
 */
const calcG = (things, minMaxX, minMaxY) => a => {
  // const wrapX = wrap(minMaxX);
  // const wrapY = wrap(minMaxY);
  // const offset = Object.assign({}, a);
  // offset.x = 0;
  // offset.y = 0;
  return things.reduce((g, b) => {
    if (a !== b) { // exclude itself
      // const tmp = Object.assign({}, b);
      // tmp.x = wrapX(tmp.x - a.x);
      // tmp.y = wrapY(tmp.y - a.y);
      // const dist = distance(offset, tmp);
      // const attr = attraction(offset, tmp, dist);
      // const pt = vToP(angle(offset, tmp), attr);
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
}
 
export default { mass, calcG, wrap }