var Default = function(genD, kinD, worldD, mode = 1, sType = 1) {
  this.gen = genD;
  this.kin = kinD;
  this.world = worldD;
  this.mode = mode;
  this.sType = sType;
}
let defaultData;
let bS = true;
let wS = true;
let sS = true;

function init() {
  //SETUP
  defaultData = new Default(new ObjGenD(), new ObjKinD(), new WorldD(9.81, true), 2);
  document.getElementById('ballF').reset();
  document.getElementById('worldF').reset();
  document.getElementById('showF').reset();
  document.getElementById('modeSel').value = 2;
  modeType();

  var a = 0;
  for (let div of document.getElementsByClassName('worldEx')) {
    if (a > 0) {
      div.style.display = 'none';
    }
    a++;
  }
  //HEADERS
  document.getElementById('ballH').addEventListener('click', function() {
    bS = !bS;
    let ball = select('#ballF');
    if(bS) { ball.show(); }
    else { ball.hide(); }
  });
  document.getElementById('worldH').addEventListener('click', function() {
    wS = !wS;
    let world = select('#worldF');
    if(wS) { world.show(); }
    else { world.hide(); }
  });
  document.getElementById('showH').addEventListener('click', function() {
    sS = !sS;
    let show = select('#showF');
    if(sS) { show.show(); }
    else { show.hide(); }
  });
  //INPUT BUTTONS
  document.getElementById('reset-formB').addEventListener('click', resetF);
  document.getElementById('default-formB').addEventListener('click', defaultF);
  document.getElementById('set-default-formB').addEventListener('click', newDefaultF);
  document.getElementById('apply-formB').addEventListener('click', applyF);
  //INPUTS
  for (let input of document.getElementsByClassName('form-numInC')) {
    input.addEventListener('click', inputChange);
  }
  document.getElementById('in-wIn').addEventListener('click', function() { exForm('in-wIn', 'worldEx') });
  document.getElementById('in-tail').addEventListener('click', function() { exForm('in-tail', 'showEx') });
  document.getElementById('showF').addEventListener('input', function() { obj.showNewData(); });
  //SELECTS
  document.getElementById('modeSel').addEventListener('change', modeType);
  document.getElementById('sel-v-type').addEventListener('change', speedType);
  //MENU BUTTONS
  document.getElementById('menuInputB').addEventListener('mouseenter', function() {
    document.getElementById('menuInputB').style.borderRadius = '0px 10px 10px 0px';
    document.getElementById('menuInputB').style.width = '80px';
    document.getElementById('menuInputB').innerText = 'Input';
  });
  document.getElementById('menuInputB').addEventListener('mouseleave', function() {
    document.getElementById('menuInputB').style.borderRadius = '0px 10px 0px 0px';
    document.getElementById('menuInputB').style.width = '40px';
    document.getElementById('menuInputB').innerText = 'I';
  });
  document.getElementById('menuTableB').addEventListener('mouseenter', function() {
    document.getElementById('menuTableB').style.borderRadius = '0px 10px 10px 0px';
    document.getElementById('menuTableB').style.width = '80px';
    document.getElementById('menuTableB').innerText = 'Table';
  });
  document.getElementById('menuTableB').addEventListener('mouseleave', function() {
    document.getElementById('menuTableB').style.borderRadius = '0px 0px 10px 0px';
    document.getElementById('menuTableB').style.width = '40px';
    document.getElementById('menuTableB').innerText = 'T';
  });
}

function resetF() {
  document.getElementById('defaultP').style.display = 'none';
  let forms = document.getElementsByTagName('form');
  for (let form of forms) {
    form.reset();
  }
  modeType();
}

function defaultF() {
  document.getElementById('modeSel').value = defaultData.mode;
  document.getElementById('in-wIn').checked = defaultData.world.is;
  document.getElementById('sel-v-type').value = defaultData.sType;
  modeType(false);
  let fIs = document.getElementsByClassName('form-numInC');
  let fSs = document.getElementsByClassName('form-select');

  fIs[0].value = prR(defaultData.gen.m / fSs[0].value, 3);
  fIs[1].value = prR(defaultData.gen.r / fSs[1].value, 3);
  fIs[2].value = prR(defaultData.kin.y / fSs[2].value, 3);
  fIs[3].value = prR(defaultData.kin.vX / fSs[3].value, 3);
  if (defaultData.sType == 1) {
    fIs[4].value = prR(defaultData.kin.vY / fSs[3].value, 3);
  }
  else {
    fIs[4].value = prR(defaultData.kin.vY / fSs[4].value, 3);
  }
  fIs[5].value = prR(defaultData.world.g / fSs[5].value, 3);
  fIs[6].value = prR(defaultData.world.d / fSs[6].value, 3);
  fIs[7].value = prR(defaultData.world.v / fSs[7].value, 3);
}

function newDefaultF() {
  let mode = Number(document.getElementById('modeSel').value);
  let good;
  switch (mode) {
    case 1: good = validate(); break;
    case 2: good = validate(); break;
    case 3: good = validate(true); break;
  }

  if (good) {
    defaultData.mode = mode;
    defaultData.world.is = document.getElementById('in-wIn').checked;
    defaultData.sType = document.getElementById('sel-v-type').value;

    let fIs = document.getElementsByClassName('form-numInC');
    let fSs = document.getElementsByClassName('form-select');

    defaultData.gen.m = prR(fIs[0].value * fSs[0].value, 3);
    defaultData.gen.r = prR(fIs[1].value * fSs[1].value, 3);
    defaultData.kin.y = prR(fIs[2].value * fSs[2].value, 3);
    defaultData.kin.vX = prR(fIs[3].value * fSs[3].value, 3);
    if (defaultData.sType == 1) {
      defaultData.kin.vY = prR(fIs[4].value * fSs[3].value, 3);
    }
    else {
      defaultData.kin.vY = prR(fIs[4].value * fSs[4].value, 3);
    }
    defaultData.world.g = prR(fIs[5].value * fSs[5].value, 3);
    defaultData.world.d = prR(fIs[6].value * fSs[6].value, 3);
    defaultData.world.v = prR(fIs[7].value * fSs[7].value, 3);
    document.getElementById('defaultP').style.display = 'inline-block';
  }
}

function applyF() {
  let mode = Number(document.getElementById('modeSel').value);
  let good;
  switch (mode) {
    case 1: good = validate(); break;
    case 2: good = validate(); break;
    case 3: good = validate(true); break;
  }

  if (good) {
    if (mode === 3) {
      obj.inputNewDataMax();
    }
    else {
      obj.inputNewData();
    }
  }
  else {
    console.log('not ok');
  }
}

function validate(max = false) {
  let valid = true;
  let units = document.getElementsByClassName('form-select');
  let inputs = document.getElementsByClassName('form-numInC');
  let worldChb = document.getElementById('in-wIn').checked;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].className === 'form-numInC ball-numInC') {
      if (isNaN(inputs[i].value) || inputs[i].value === '') {
        if (!max || (max && i != 4)) {
          valid = false;
          inputs[i].style.borderColor = 'red';
          inputs[i].value = '';
          inputs[i].placeholder = 'Give a number';
        }
      }
      else {
        switch(i) {
          //M
          case 0:
          if (prR(Number(inputs[i].value), 3) <= 0) {
            inputs[i].placeholder = 'Must be >0';
          }
          break;
          //R
          case 1:
          if (prR(Number(inputs[i].value), 3) <= 0) {
            inputs[i].placeholder = 'Must be >0';
          }
          else if (prR(Number(inputs[i].value), 3) > prR(5 / units[i].value, 3)) {
            inputs[i].placeholder = 'Must be <=' + prR(5 / units[i].value, 1);
          }
          break;
          //Y
          case 2:
          if (prR(Number(inputs[i].value), 3) <= 0) {
            inputs[i].placeholder = 'Must be >0';
          }
          else if (prR(Number(inputs[i].value), 3) > prR(3000 / units[i].value, 3)) {
            inputs[i].placeholder = 'Must be <=' + prR(3000 / units[i].value, 1);
          }
          break;
          //V
          case 3:
          case 4:
          if (document.getElementById('sel-v-type').value == 1) {
            if (prR(Number(inputs[i].value), 3) <= 0) {
              inputs[i].placeholder = 'Must be >0';
            }
            else if (prR(Number(inputs[i].value), 3) > prR(1000 / units[3].value, 3)) {
              inputs[i].placeholder = 'Must be <=' + prR(1000 / units[3].value, 1);
            }
          }
          else {
            if (i === 3) {
              if (prR(Number(inputs[i].value), 3) <= 0) {
                inputs[i].placeholder = 'Must be >0';
              }
              else if (prR(Number(inputs[i].value), 3) > prR(1500 / units[3].value, 3)) {
                inputs[i].placeholder = 'Must be <=' + prR(1500 / units[3].value, 1);
              }
            }
            if (i === 4) {
              if(units[i].value == 1) {
                var num = Number(inputs[i].value);
                while (num >= 360) {
                  num -= 360;
                }
                if (num > 90) {
                  inputs[i].placeholder = 'Must be <=90°';
                }
                else if (num < -90) {
                  inputs[i].placeholder = 'Must be >=-90°';
                }
                else {
                  inputs[i].value = prR(num, 3);
                }
              }
              else {
                var num = Number(inputs[i].value);
                while (num >= 2) {
                  num -= 2;
                }
                if (num > .5) {
                  inputs[i].placeholder = 'Must be <=.5π';
                }
                else if (num < -.5) {
                  inputs[i].placeholder = 'Must be >=-.5π';
                }
                else {
                  inputs[i].value = prR(num, 3);
                }
              }
            }
          }
          break;
        }
        if (inputs[i].placeholder != '') {
          valid = false;
          inputs[i].value = '';
          inputs[i].style.borderColor = 'red';
        }
      }
    }

    else if (inputs[i].className === 'form-numInC world-numBC') {
      if (worldChb) {
        if (isNaN(inputs[i].value) || inputs[i].value === '') {
          valid = false;
          inputs[i].style.borderColor = 'red';
          inputs[i].value = '';
          inputs[i].placeholder = 'Give a number';
        }
        else {
          switch(i) {
            case 6:
            if (prR(Number(inputs[i].value), 3) <= 0) {
              inputs[i].placeholder = 'Must be >0';
            }
            break;
            case 7:
            if (prR(Number(inputs[i].value), 3) < prR(-100 / units[i].value, 3)) {
              inputs[i].placeholder = 'Must be >=' + prR(-100 / units[i].value, 1);
            }
            else if (prR(Number(inputs[i].value), 3) > prR(100 / units[i].value, 3)) {
              inputs[i].placeholder = 'Must be <=' + prR(100 / units[i].value, 1);
            }
            break;
          }
          if (inputs[i].placeholder != '') {
            valid = false;
            inputs[i].value = '';
            inputs[i].style.borderColor = 'red';
          }
        }
      }
      if (i === 5) {
        if (isNaN(inputs[i].value) || inputs[i].value === '') {
          valid = false;
          inputs[i].style.borderColor = 'red';
          inputs[i].value = '';
          inputs[i].placeholder = 'Give a number';
        }
        else {
          if (prR(Number(inputs[i].value), 3) < prR(1.5 / units[i].value, 3)) {
            inputs[i].placeholder = 'Must be >=' + prR(1.5 / units[i].value, 1);
            valid = false;
            inputs[i].value = '';
            inputs[i].style.borderColor = 'red';
          }
          else if (prR(Number(inputs[i].value), 3) > prR(30 / units[i].value, 3)) {
            inputs[i].placeholder = 'Must be <=' + prR(30 / units[i].value, 1);
            valid = false;
            inputs[i].value = '';
            inputs[i].style.borderColor = 'red';
          }
        }
      }
    }
  }
  return valid;
}

function inputChange() {
  let inputs = document.getElementsByClassName('form-numInC');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].style.borderStyle = 'inset';
    inputs[i].style.borderColor = '#AAA';
    inputs[i].placeholder = '';
  }
  document.getElementById('defaultP').style.display = 'none';
}

function exForm(chb, ex) {
  if (!document.getElementById(chb).checked) {
    for (let div of document.getElementsByClassName(ex)) {
      div.style.display = 'none';
    }
  }
  else {
    for (let div of document.getElementsByClassName(ex)) {
      div.style.display = 'inline-block';
      div.style.position = 'relative';
      div.style.width = '100%';
    }
  }
}

function speedType() {
  if (Number(document.getElementById('sel-v-type').value) === 1) {
    document.getElementById('lab-1').innerText = 'Speed x: ';
    document.getElementById('lab-2').innerText = 'Speed y: ';
    document.getElementById('sel-v-2').style.display = 'none';
  }
  else if (Number(document.getElementById('sel-v-type').value) == 2){
    document.getElementById('lab-1').innerText = 'Speed: ';
    document.getElementById('lab-2').innerText = 'Angle: ';
    document.getElementById('sel-v-2').style.display = 'inline-block';
  }
}

function modeType(reset = true) {
  let mode = Number(document.getElementById('modeSel').value);
  let ops = document.getElementsByClassName('op-v-2');
  let fDs = selectAll('.ballFormD');
  let num;
  switch (mode) {
    case 1:
    speedType();
    document.getElementById('worldH').style.display = 'none';
    document.getElementById('worldF').style.display = 'none';
    fDs[0].hide();
    fDs[1].hide();
    if(reset) { fillInputs(); }
    document.getElementById('in-v-2').style.display = 'inline-block';
    num = 1;
    for (let op of ops) {
      op.innerText = (num === 1)? '°' : 'π';
      op.value = num;
      num *= 180;
    }
    document.getElementById('sel-v-type').disabled = false;
    break;

    case 2:
    startForm(reset);
    speedType();
    document.getElementById('in-v-2').style.display = 'inline-block';
    num = 1;
    for (let op of ops) {
      op.innerText = (num === 1)? '°' : 'π';
      op.value = num;
      num *= 180;
    }
    document.getElementById('sel-v-type').disabled = false;
    break;

    case 3:
    startForm(reset);

    document.getElementById('sel-v-type').value = 2;
    speedType();
    document.getElementById('lab-2').innerText = 'Angle step: ';
    document.getElementById('in-v-2').style.display = 'none';
    num = 1;
    for (let op of ops) {
      op.innerText = num + '°';
      op.value = num;
      num /= 10;
    }
    document.getElementById('sel-v-type').disabled = true;
    break;
  }
}

function fillInputs() {
  let fIs = document.getElementsByClassName('form-numInC');
  let val = [1, 0.1, '', '', '', 9.81, 1.225, 0];
  for (var i = 0; i < fIs.length; i++) {
    fIs[i].value = val[i];
  }
}

function startForm(reset) {
  if(reset) {
    document.getElementById('ballF').reset();
    document.getElementById('worldF').reset();
  }
  document.getElementById('worldH').style.display = 'inline-block';
  document.getElementById('worldF').style.display = 'inline-block';
  exForm('in-wIn', 'worldEx');
  exForm('in-tail', 'showEx');
  let fDs = selectAll('.ballFormD');
  for (let fD of fDs) {
    fD.show();
  }
}
