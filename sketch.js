var canvas, canvasHeight, canvasPosY;
var mainButtonsDiv;
var timeUnit = 1/ 30;
var obj;

function setup() {
  frameRate(30);
  
  canvas = createCanvas(windowWidth - 100, windowHeight - 100);
  canvas.position(50, 40);
  obj = new Obj(timeUnit);

  mainControls(obj);
  mainDivs(obj);
  dataTable(obj);
  init();
  obj.set();
}

function draw() {
  obj.show();
}
