/**
 * Some typedefs to help keep track of things.
 * 
 * @typedef Settings Control parameters.
 * @property {boolean} drawGforce Adds a vector showing the total gravity.
 * @property {boolean} drawTails Adds a velocity vector as an item's tail.
 * @property {boolean} showOrigin Puts a circle at 0,0.
 * 
 * @typedef Thing Represents some mass in our little universe.
 * @property {string} id A unique ID for the item.
 * @property {number} x The x coordinate.
 * @property {number} y The y coordinate.
 * @property {number} mass The object's mass.
 * @property {Point} v The object's velocity.
 * @property {GForce} g Gravitational pull on the object.
 * @property {Thing=} coll An object this is colliding with.
 * 
 * @typedef Point Generic representation of a coordinate, vector, or other.
 * @property {number} x
 * @property {number} y
 * 
 * @typedef GForce Gravitational information acting on an object.
 * @property {number} x Expressed as a point instead of angle/magnitude
 * @property {number} y Expressed as a point instead of angle/magnitude
 * @property {Nearest} nearest The nearest other object.
 * @property {Thing=} coll An object this is colliding with.
 * 
 * @typedef Nearest Information about the nearest object.
 * @property {Thing} thing The object closest to this.
 * @property {number} dist The distance to the nearest thing.
 * @property {number} attr The attraction to this nearest object.
 * 
 * @typedef WorkerControls Pause/resume functions for the worker.
 * @property {() => void} stop Pause function.
 * @property {() => void} resume Resume function.
 * 
 * @typedef CanvasSetup
 * @property {CanvasRenderingContext2D} ctx
 * @property {number} minMaxX Maximum x value (positive or negative)
 * @property {number} minMaxY Maximum y value (positive or negative)
 * 
 * @typedef Color Represents an RGB color.
 * @property {number} r Red
 * @property {number} g Green
 * @property {number} b Blue
 * 
 * @typedef RegEntry For the renderer, contains the state of a registered object.
 * @property {Color} color The current color of the object.
 * @property {(CanvasRenderingContext2D, Thing, Settings) => void} render Render function.
 */