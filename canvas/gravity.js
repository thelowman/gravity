// settings
numObjects = 100;

// initialize our variables
const elem = document.getElementById('canvas');
const ctx = document.getElementById('canvas').getContext('2d');
let width;
let height;
let minMaxX;
let minMaxY;


// const background = new OffscreenCanvas();
function initializeBackground(){
  background.width = width;
  background.height = height;
  let ratio = width / height;
  // if(width > height)
}
//document.getElementById('background');


// sets up the translate
function resize(){
  width = window.innerWidth - 2; // decrease the size to prevent scroll bars
  height = window.innerHeight - 4; // decrease the size to prevent scroll bars
  elem.width = width;
  elem.height = height;

  minMaxX = width / 2;
  minMaxY = height / 2;

  ctx.resetTransform();
  ctx.translate(Math.floor(width / 2) - 1, Math.floor(height / 2) - 1);
  ctx.scale(1, -1);
}
window.onresize = resize;
resize();

// calculates distance between 2 points
function distance(obj1, obj2){
  let dx = obj2.x - obj1.x;
  let dy = obj2.y - obj1.y;
  // console.log('delta x: ' + dx);
  // console.log('delta y: ' + dy);
  // console.log('distance: ' + Math.sqrt((dx * dx) + (dy * dy)));
  return Math.sqrt((dx * dx) + (dy * dy));
}

// calculates the attraction between two masses
function attraction(mass1, mass2, dist){
  // the result below should be multiplied
  // by the gravitational constant
  return (mass1 * mass2) / (dist * dist)
}


// represents some mass for our space
// mass = 0 - 100
// velocity = 0 - 5
function mass(){
  this.x = width / 2 - Math.random() * width;
  this.y = height / 2 - Math.random() * height;
  this.mass = Math.random() * 100;
  this.angle = Math.random() * 2 * Math.PI;
  this.velocity = Math.random() * 5;
  this.underInfluence = false;


  // update the position
  this.updatePosition = () =>{
    this.x += Math.sin(this.angle) * this.velocity;
    this.y += Math.cos(this.angle) * this.velocity;
    if(Math.abs(this.x) > minMaxX * 1.25)
      this.x = this.x * -1;
    if(Math.abs(this.y) > minMaxY * 1.25)
      this.y = this.y * -1;
  }
  this.render = () =>{
    // draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.floor(this.mass / 10), 0, Math.PI * 2, true);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // draw max influence
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, Math.floor(this.mass), 0, Math.PI * 2, true);
    // if(this.underInfluence) ctx.strokeStyle = '#ff0';
    // else ctx.strokeStyle = '#0ff';
    // ctx.stroke();

    // coordinates (upside down)
    // ctx.beginPath();
    // ctx.fillText(this.mass.toFixed(0), this.x, this.y);
    // ctx.fillStyle = '#fff';
    // ctx.stroke();

    // motion vector
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.lineTo(
    //   this.x + (Math.sin(this.angle) * this.velocity * 4),
    //   this.y + (Math.cos(this.angle) * this.velocity * 4)
    // );
    // ctx.strokeStyle = '#f00';
    // ctx.stroke();
    this.underInfluence = false;
  }
}

// initialize our objects of mass
let spaceObjects = [];
for(let i = 0; i < numObjects; i++){
  spaceObjects.push(new mass());
}





const update = (time) => {
  ctx.drawImage(background, minMaxX * -1, minMaxY * -1);
  // ctx.rect(minMaxX * -1, minMaxY * -1, elem.width, elem.height);
  // ctx.fill();

  // update all positions
  for(let i = 0; i < spaceObjects.length; i++)
    spaceObjects[i].updatePosition();

  // draw the axes
  // ctx.beginPath();
  // ctx.moveTo(minMaxX * -1, 0);
  // ctx.lineTo(minMaxX, 0);
  // ctx.moveTo(0, minMaxY * -1);
  // ctx.lineTo(0, minMaxY);
  // ctx.strokeStyle = '#fff';
  // ctx.stroke();

  // influences
  for(let a = 0; a < spaceObjects.length; a++){
    for(let b = 0; b < spaceObjects.length; b++){
      if(a != b){
        let objA = spaceObjects[a];
        let objB = spaceObjects[b];
        let dist = objA && objB ? distance(objA, objB) : 100000000;
        if(dist < objA.mass + objB.mass){
          if(dist < (objA.mass + objB.mass) / 100){
            objA.mass += objB.mass;
            spaceObjects.splice(spaceObjects.indexOf(objB), 1);
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
  
            // draw line showing influence
            // ctx.beginPath();
            // ctx.moveTo(objA.x, objA.y);
            // ctx.lineTo(objB.x, objB.y);
            // ctx.strokeStyle = '#0f0';
            // ctx.strokeWidth = 
            // ctx.stroke();
            // ---------------------------
          }
        }
      }
    }
  }
    

  spaceObjects.forEach(obj => obj.render());  
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
// update();
