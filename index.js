
class CanvasWriter {

  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  write(mojeCanvas, explosion){

    const elapsed = (explosion.elapsed()) * .001;
    this.opacity(explosion.opacity(elapsed));


    explosion.eachParticle((particle) => {
      this.draw(particle.mojeCanvas, particle.x(elapsed), particle.y(elapsed), particle.z(elapsed), particle.rotationRad(elapsed));
      this.reset();
    }, "z", elapsed)
  }

  clear(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // center(){
  //   this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
  // }
  move(x, y){
    this.context.translate(x + this.canvas.width / 2, y + this.canvas.height / 2);
  }
  reset(){
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }
  opacity(opacity){
    this.context.globalAlpha = Math.max(opacity, 0);
  }
  draw(canvasToDrawFrom, x, y, z, radians){
    const coordX = x;
    const coordY = y;

    this.move(coordX, coordY);
    this.context.rotate(radians);

    const targetWidth = canvasToDrawFrom.width * (0.25 + z);
    const targetHeight = canvasToDrawFrom.height * (0.25 + z);

    this.context.drawImage(canvasToDrawFrom, 
                            0 - (targetWidth / 2), 
                            0 - (targetHeight / 2),
                            targetWidth, 
                            targetHeight);
  }

}


class Explosion {

  constructor(originX, originY, mojeCanvases) {
    this.mojeCanvases = mojeCanvases;

    this.particles = []
    this.makeParticles(20, originX, originY)
  }

  makeParticles(howMany, originX, originY){
    for (var i = 0; i < howMany; i++) {
      this.particles.push(new Particle(originX, originY, this.randomMojeCanvas()))
    }
  }

  randomMojeCanvas() {
    const length = this.mojeCanvases.length;
    const idx = Math.floor(Math.random() * length);
    return this.mojeCanvases[idx];
  }

  eachParticle(fn, sortBy, t) {
    this.sortedParticles(sortBy, t).forEach(fn);
  }


  sortedParticles(by, t) {
    return this.particles.sort(function compare(a, b) {
      const aCriterion = a[by](t);
      const bCriterion = b[by](t);
      if (aCriterion > bCriterion) {
        return 1;
      }
      if (aCriterion < bCriterion) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
  }

  run(){
    this.startTime = performance.now();
  }

  elapsed() {
    return performance.now() - this.startTime
  }

  isOver() {
    return this.elapsed() >= 2500;
  }

  opacity() {
    const elapsed = this.elapsed();

    if (elapsed <= 250) {
      return this.easeInOutQuad(elapsed, 0.0, 1.0, 250)
    }
    else if (elapsed <= 1000)
      return 1;
    else if (elapsed >= 2000)
      return 0;
    else
      return this.easeOpacity(elapsed - 1000)
  }


  easeOpacity(t){
    return this.easeInOutQuad(t, 1.0, -1.0, 1000)
  }

  // penner
  easeInOutQuad(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  }

}



const DEGREES_IN_CIRCLE = 360;
const RADIANS_360_DEGREES = DEGREES_IN_CIRCLE * (Math.PI/180);

class Particle {


  constructor(originX, originY, mojeCanvas){

    this.mojeCanvas = mojeCanvas;


    this.originX = originX;
    this.originY = originY;

    this.accelerationY = 360; //gravity

    const UP = -360;

    const initalVelocity = this.randomBetween(100, 200);
    const initialAngle = this.randomBetween(0, RADIANS_360_DEGREES);

    this.initialVelocityX = initalVelocity * Math.cos(initialAngle);
    this.initialVelocityY = UP + initalVelocity * Math.sin(initialAngle);
    this.initialVelocityZ = this.randomBetween(-0.1, .1);

    this.initialRotation = this.randomBetween(0, RADIANS_360_DEGREES);
    this.rotationVelocity = this.randomBetween(-2, 2);
  }

  randomBetween(min, max){
    return Math.random() * (max - min) + min;
  }

  rotationRad(t) {
    return this.initialRotation + this.rotationVelocity * t;
  }

  y(t) {
    return this.originY + this.initialVelocityY * t + (this.accelerationY / 2) * Math.pow(t, 2);
  }
  x(t) {
    return this.originX + this.initialVelocityX * t;
  }
  z(t) {

    if (this.cachedCurrentVelocityT === t) {
      return this.cachedCurrentVelocity;
    }
    else {
      const currentVelocity = this.initialVelocityZ * t;
      //cache it
      this.cachedCurrentVelocity = currentVelocity;
      this.cachedCurrentVelocityT = t;
      //do it
      return currentVelocity;
    }
  }
}

// // let deg = 0;
// let rad = 0.5;
let mojeCanvas = null
// let mainContext = null;
// // const height = 200;

// function doit(){

  
//   mainContext.clearRect(0, 0, 1000, 1000);

//   mainContext.translate(500,500);
//   mainContext.rotate(rad);
//   rad += 0.1
  
//   mainContext.drawImage(mojeCanvas, 0 - mojeCanvas.width / 2, 0 - mojeCanvas.height / 2);
  

//   mainContext.setTransform(1, 0, 0, 1, 0, 0);
//   requestAnimationFrame(doit);
// }


// function makeFireworks() {
//   let particle = new ParticleContainer();
//   let particle = new Particle();
//   document.append
// }

// function getContext(id) {
//   const canvas = document.getElementById(id);
//   return canvas.getContext("2d");
// }


function clearMojies(container){
  container.innerHTML = "";
}

function doSecretEmojiCanvas(mojies, txt){
  const height = 256;

  const singleMojeCanvas = document.createElement("canvas");
  singleMojeCanvas.height = height;
  singleMojeCanvas.width = height;
  mojies.appendChild(singleMojeCanvas);

  const singleMojeContext = singleMojeCanvas.getContext("2d")

  // singleMojeContext.clearRect(0, 0, singleMojeCanvas.width, singleMojeCanvas.height);

  singleMojeContext.translate(singleMojeCanvas.width / 2,singleMojeCanvas.height / 2);

  singleMojeContext.font=`${ height }px Georgia`;
  const { width } = singleMojeContext.measureText(txt);
  singleMojeContext.fillText(txt, 0 - (width / 2), 0 + (height / 2.35));

  // singleMojeContext.setTransform(1, 0, 0, 1, 0, 0);

  return singleMojeCanvas
}



// function doSecretEmojiCanvas(id, txt){
//   const height = 256;

//   const singleMojeCanvas = document.getElementById(id);
//   const singleMojeContext = singleMojeCanvas.getContext("2d")

//   singleMojeContext.clearRect(0, 0, singleMojeCanvas.width, singleMojeCanvas.height);

//   singleMojeContext.translate(singleMojeCanvas.width / 2,singleMojeCanvas.height / 2);

//   singleMojeContext.font=`${ height }px Georgia`;
//   const { width } = singleMojeContext.measureText(txt);
//   singleMojeContext.fillText(txt, 0 - (width / 2), 0 + (height / 2.35));

//   singleMojeContext.setTransform(1, 0, 0, 1, 0, 0);

//   return singleMojeCanvas
// }


let splosions = []
let doingIt = false
let cw = null;

function doit(){
  splosions = splosions.filter((splode) => !splode.isOver());

  if (splosions.length) {
    cw.clear()
    splosions.forEach((boom) => {
      cw.write(mojeCanvas, boom)
    })
    requestAnimationFrame(doit)
  }
}

function setup(x, y){

  const boom = new Explosion(x,y, mojeCanvases);
  boom.run();

  splosions.push(boom)

  if (!doingIt) {
    requestAnimationFrame(doit);
  } 

}



document.addEventListener("DOMContentLoaded", () => {

  cw = new CanvasWriter(document.getElementById("real-one"));

  const input = document.getElementById("moje")
  if (!input.value.length) input.value = localStorage.lastEmoje || "";

  // TODO ugh global TODO
  // mojeCanvas = doSecretEmojiCanvas("single-moje", input.value);
  mojies = document.getElementById("mojies")

  const refreshMojeCanvases = () => {
    clearMojies(mojies)
    mojeCanvases = input.value.split(/\s+|,/).map((moje) => doSecretEmojiCanvas(mojies, moje));
  }
  
  refreshMojeCanvases();

  const persistInputValue = function(e) {
    localStorage.lastEmoje = this.value;
    refreshMojeCanvases();
  }

  input.addEventListener("blur", persistInputValue);
  input.addEventListener("keyUp", persistInputValue);

  document.getElementById("real-one").addEventListener("click", function(e) {
    const x = (e.pageX - this.offsetLeft) * 2 - (this.width / 2); 
    const y = (e.pageY - this.offsetTop) * 2 - (this.height / 2); 

    setup(x, y)
  })
})


// class Particle {
  
// }