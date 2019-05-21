// settings
const numObjects = 200;

const space = document.querySelector('.space');
let width;
let height;
let minMaxX;
let minMaxY;


function resize(){
  width = window.innerWidth;
  height = window.innerHeight;
  minMaxX = width / 2;
  minMaxY = height / 2;
}
window.onresize = resize;
resize();

const massThresholds = [
  {
    mass: 0,
    sizeMultiplyer: .1,
    images: ['asteroid1.png', 'asteroid2.png', 'asteroid2.png']
  },
  {
    mass: 300,
    sizeMultiplyer: .05,
    images: ['jovian1.png', 'jovian2.png', 'jovian3.png']
  }
];

// the main objects
function mass(){
  this.x = width / 2 - Math.random() * width;
  this.y = height / 2 - Math.random() * height;
  this.mass = Math.random() * 100;
  this.angle = Math.random() * 2 * Math.PI;
  this.velocity = Math.random() * 5;
  this.diameter = 0;
  this.destroyed = false;

  this.elem = document.createElement('div');
  space.appendChild(this.elem);
  this.elem.className = 'mass';

  this.init = () => {
    let thresholdIndex = 0;
    for(let i = 1; i < massThresholds.length; i++){
      if(massThresholds[i].mass > this.mass) break;
      else thresholdIndex = i;
    }
    this.diameter = this.mass * massThresholds[thresholdIndex].sizeMultiplyer;
    this.elem.style.width = this.diameter + 'px';
    this.elem.style.height = this.diameter + 'px';
    this.elem.innerText = this.mass.toFixed(0);
  }
  
  this.init();

  this.updatePosition = () =>{
    this.x += Math.sin(this.angle) * this.velocity;
    this.y += Math.cos(this.angle) * this.velocity;
    if(Math.abs(this.x) > minMaxX * 1.25)
      this.x = this.x * -1;
    if(Math.abs(this.y) > minMaxY * 1.25)
      this.y = this.y * -1;

    this.elem.style.left = (this.x - 50) + 'px';
    this.elem.style.top = (this.y - 50) + 'px';
  }
  this.consume = (other) => {
    this.mass += other.mass;
    spaceObjects.splice(spaceObjects.indexOf(other), 1);
    this.init();
    other.destroy();
  }
  this.destroy = () => {
    if(!this.destroyed){
      space.removeChild(this.elem);
      this.destroyed = true;
    }
  }
}


// initialize our objects of mass
let spaceObjects = [];
for(let i = 0; i < numObjects; i++){
  spaceObjects.push(new mass());
}


// calculates distance between 2 points
function distance(obj1, obj2){
  let dx = obj2.x - obj1.x;
  let dy = obj2.y - obj1.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}


// calculates the attraction between two masses
function attraction(mass1, mass2, dist){
  return (mass1 * mass2) / (dist * dist)
}


const update = () => {
  for(let i = 0; i < spaceObjects.length; i++)
    spaceObjects[i].updatePosition();

  // now apply a little gravity for the next frame
  for(let a = 0; a < spaceObjects.length; a++){
    let objA = spaceObjects[a];
    for(let b = 0; b < spaceObjects.length; b++){
      if(a != b){
        let objB = spaceObjects[b];
        let dist = objA && objB ? distance(objA, objB) : 100000000;
        if(!objA)
          console.log('No A');
        if(!objB)
          console.log('No B');
        // if(dist < objA.mass + objB.mass){
          if(dist < (objA.mass + objB.mass) / 100){
            // if this is the larger object it is the consumer
            // otherwise let the other object to handle it
            if(objA.mass > objB.mass){
              objA.consume(objB);
            }
          }
          else{
            objA.underInfluence = true;
            let angle = Math.atan2(objB.x - objA.x, objB.y - objA.y);
            let force = attraction(objA.mass, objB.mass, dist) / (objA.mass * .6);
            
            let dX = Math.sin(objA.angle) * objA.velocity;
            let dY = Math.cos(objA.angle) * objA.velocity;
            let gX = Math.sin(angle) * force;
            let gY = Math.cos(angle) * force;
            let rX = dX + gX;
            let rY = dY + gY;
            objA.velocity = Math.sqrt((dX * dX) + (dY * dY));
            objA.angle = Math.atan2(rX, rY);
          }
        // }
      }
    }
  }

  requestAnimationFrame(update);
}
requestAnimationFrame(update);
// update();
