var updateTable = false;
var menuOut = false;
var whichDivOut = '';
var running = false;

//MAIN BUTTONS

function mainControls(obj) {
  var buttons = [];
  var buttonsId = ['scrollingBackB', 'scrollingForwardB', 'startStopB', 'resetB', 'menuInputB', 'menuTableB', 'menuInB'];
  buttons.push(createButton('⏮'));
  buttons.push(createButton('⏭'));
  buttons.push(createButton('⏯'));
  buttons.push(createButton('⏹'));
  buttons.push(createButton('I'));
  buttons.push(createButton('T'));
  buttons.push(createButton('➔'));

  var slider = createSlider(0, 0, 0);
  slider.id('scrollingS');
  slider.position(70, windowHeight - 40);
  slider.attribute('step', 1);
  slider.size(width - 220);

  var a = 0;
  for (var button of buttons) {
    button.class('mainBC');
    button.id(buttonsId[a]);
    button.position(40 + width - (160 - a * 40), windowHeight - 50);
    a++;
  }
  buttons[4].position(0, 40);
  buttons[5].position(0, 80);
  buttons[6].position(0, 0);
  buttons[6].hide();


  buttons[0].addClass('leftBC');
  buttons[1].addClass('centerBC');
  buttons[2].addClass('centerBC');
  buttons[3].addClass('rightBC');
  buttons[4].addClass('menuBC');
  buttons[5].addClass('menuBC');

  mainControlsEvents(obj);
}

function mainControlsEvents(obj) {
  var slider = select('#scrollingS');
  var buttons = selectAll('.mainBC');
  var maxTable = select('#maxT');
  var currTable = select('#currT');

  //ANIMATION CONTROLS
  buttons[0].mousePressed(function() {
    if(obj.cPos > 1) {
      obj.cPos-=2;
    }
    redraw();
  });
  buttons[1].mousePressed(function() {
    redraw();
  });
  buttons[2].mousePressed(function() {
    running = !running;
    if(running) {
      loop();
    }
    else {
      noLoop();
    }
  });
  buttons[3].mousePressed(function() {
    running = false;
    obj.set();
    redraw();
  });

  //MENU BUTTONS
  buttons[4].mousePressed(function() { menuOutButtonPressed('Input'); });
  buttons[5].mousePressed(function() { menuOutButtonPressed('Table'); });
  buttons[6].mousePressed(function() { menuInButtonPressed(); });

  slider.mousePressed(function() { noLoop(); running = false;});
  slider.mouseMoved(function() {
    if(mouseIsPressed) {
      obj.cPos = slider.value();
      redraw();
    }
  });
}

function menuOutButtonPressed(divSelect) {
  menuOut = true;
  whichDivOut = divSelect;
  document.getElementById('menuInputB').style.left = '450px';
  document.getElementById('menuTableB').style.left = '450px';
  mainDivsState(divSelect, obj, true);
  resizeAll();
}
function menuInButtonPressed() {
  menuOut = false;
  whichDivOut = '';
  document.getElementById('menuInputB').style.left = '450px';
  document.getElementById('menuTableB').style.left = '450px';
  mainDivsState('Input', obj, false);
  resizeAll();
}

//TABLES

function dataTable() {
  var maxTable = select('#maxT');
  var currTable = select('#currT');
  maxTable.parent('tableD');
  currTable.parent('tableD');
}

function tabMUpdate(obj) {
  if (whichDivOut === 'Table') {
    if (obj.maxData.prec) {
      document.getElementById('maxT').style.background = '#EEE';
      document.getElementById('maxT').style.borderColor = '#EEE';
    }
    else {
      document.getElementById('maxT').style.background = '#E33';
      document.getElementById('maxT').style.borderColor = '#E33';
    }
    var valCells = selectAll('.valCellMax');
    var timeCells = selectAll('.timeCellMax');
    var fSs = document.getElementsByClassName('form-select');
    //sMin
    valCells[0].html(prR(obj.his[obj.maxData.sMin].x / fSs[2].value, 3));
    timeCells[0].html(prR(obj.his[obj.maxData.sMin].t));
    //sMax
    valCells[1].html(prR(obj.his[obj.maxData.sMax].x / fSs[2].value, 3));
    timeCells[1].html(prR(obj.his[obj.maxData.sMax].t));
    //hMax
    valCells[2].html(prR(obj.his[obj.maxData.hMax].y / fSs[2].value, 3));
    timeCells[2].html(prR(obj.his[obj.maxData.hMax].t));
    //vMax
    var vX = obj.his[obj.maxData.vMax].vX;
    var vY = obj.his[obj.maxData.vMax].vY;
    var v = sqrt(pow(vX, 2) + pow(vY, 2));
    valCells[3].html(prR(v / fSs[3].value, 3));
    timeCells[3].html(prR(obj.his[obj.maxData.vMax].t));
    //aMax
    aX = obj.airResistance(obj.his[obj.maxData.aMax].vX);
    aY = -obj.world.g + obj.airResistance(obj.his[obj.maxData.aMax].vY, "y");
    var a = sqrt(pow(aX, 2) + pow(aY, 2));
    valCells[4].html(prR(a / fSs[5].value, 3));
    timeCells[4].html(prR(obj.his[obj.maxData.aMax].t));
    //FMax
    valCells[5].html(prR(a * obj.gen.m));
    timeCells[5].html(prR(obj.his[obj.maxData.aMax].t));
    //Total t
    timeCells[6].html(prR(obj.maxData.tTotal));
  }
}

function tabCUpdate(obj, i) {
  if (whichDivOut === 'Table') {
    if (i < 0) { i = 0; }
    var valCells = selectAll('.valCellCurr');
    var fSs = document.getElementsByClassName('form-select');

    var vX = obj.his[i].vX;
    var vY = obj.his[i].vY;
    var v = sqrt(pow(vX, 2) + pow(vY, 2));
    var aX = obj.airResistance(vX);
    var aY = -obj.world.g + obj.airResistance(vY, "y");
    var a = sqrt(pow(aX, 2) + pow(aY, 2));
    if (vX != 0) {
      var angle = abs(atan(vY / vX) * 180 / PI);
      if (vX < 0 && vY >= 0) { angle = 180 - angle; }
      else if (vX < 0 && vY < 0) { angle = 180 + angle; }
      else if (vX > 0 && vY < 0) { angle = 360 - angle; }
    }
    else { angle = 90; }
    valCells[0].html(prR(obj.his[i].x / fSs[2].value, 2));
    valCells[2].html(prR(obj.his[i].y / fSs[2].value, 2));
    valCells[4].html(prR(vX / fSs[3].value, 2));
    valCells[6].html(prR(vY / fSs[3].value, 2));
    valCells[8].html(prR(v / fSs[3].value, 2));

    valCells[1].html(prR(angle / fSs[4].value, 2) + ((fSs[4].value == 1)? '°' : 'π'));
    valCells[3].html(prR(obj.his[i].t, 2));
    valCells[5].html(prR(aX / fSs[5].value, 2));
    valCells[7].html(prR(aY / fSs[5].value, 2));
    valCells[9].html(prR(a / fSs[5].value, 2));
  }
}

//DATA DIV

function mainDivs(obj) {
  var inputD = createDiv();
  var tableD = createDiv();
  inputD.id('mainInputD');
  inputD.class('mainDC');
  inputD.child('#dataD');
  inputD.hide();
  inputD.size(450, windowHeight);
  inputD.position(0, 0);
  tableD.id('mainTableD');
  tableD.class('mainDC');
  tableD.child('#tableD');
  tableD.hide();
  tableD.size(450, windowHeight);
  tableD.position(0, 0);

  cellsResize();
}

function mainDivsState(divSelect, obj, show) {
  var divId1 = '#main' + divSelect + 'D';
  var divId2 = '#main' + ((divSelect === 'Input')? 'Table' : 'Input') + 'D';
  var div1 = select(divId1);
  var div2 = select(divId2);
  var menuInB = select('#menuInB');
  menuInB.position(0, 0);
  if(show) {
    var menuInColor = (divSelect === 'Input')? '#22D' : '#2D2';
    document.getElementById('menuInB').style.background = menuInColor;
    //menuInB.attribute('background', menuInColor);
    menuInB.show();
    div1.show();
    div2.hide();
    tabMUpdate(obj);
    tabCUpdate(obj, obj.cPos);
  }
  else {
    menuInB.hide();
    div1.hide();
    div2.hide();
  }
}

function cellsResize() {
  var varCellMaxs = selectAll('.varCellMax');
  var valMs = selectAll('.valDC');
  for (let varCellMax of varCellMaxs) { varCellMax.size(450 * .9 * .25); }
  for (let valM of valMs) { valM.size(450 * .9 * .375); }

  var varCellCurrs = selectAll('.varCellCurr');
  var valCellCurrs = selectAll('.valCellCurr');
  for (let varCellCurr of varCellCurrs) { varCellCurr.size(450 * .9 * .2); }
  for (let valCellCurr of valCellCurrs) { valCellCurr.size(450 * .9 * .3); }
}

function resizeAll() {
  var slider = select('#scrollingS');
  var buttons = selectAll('.mainBC');
  if (!menuOut) {
    canvas.resize(windowWidth - 100, windowHeight - 100);
    canvas.position(50, 40);
    slider.size(width - 220);
    slider.position(60, windowHeight - 40);
  }
  else {
    canvas.resize(windowWidth - 500, windowHeight - 100);
    canvas.position(450, 40);
    slider.size(width - 220);
    slider.position(470, windowHeight - 40);
  }
  var a = 0;
  for (var button of buttons) {
    if (a < 4) {
      button.position(windowWidth - 40 * (5 - a) - 20, windowHeight - 50);
    }
    else if(!menuOut){
      button.position(0, (a - 3) * 40);
    }
    a++;
  }
  obj.applyScale();
  obj.cPos--;
  redraw();
}

function windowResized() {
  //CANVAS & CONTROLS
  menuOut = false;
  resizeAll();
  var buttons = selectAll('.mainBC');
  //CELLS
  cellsResize();
  //MENU DIV
  mainDivsState('Input', obj, false);
  var inputD = select('#mainInputD');
  var tableD = select('#mainTableD');
  inputD.size(450, windowHeight);
  tableD.size(450, windowHeight);
}
