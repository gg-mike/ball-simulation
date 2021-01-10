var time = 0;
var sPlus = 0;

function prR(num, n = 2) {
  return Number(round(num * pow(10, n))/ pow(10, n));
}

function division(s) {
  var found = false;
  var num = 0;
  var a = [1, 2, 5];
  for (var i = 100; i >= .01 && !found; i /= 10) {
    for (var j = 2; j >= 0 && !found; j--) {
      if (i * a[j] * s <= 200 && i * a[j] > num) {
        found = true;
        num = i * a[j];
      }
    }
  }
  push();
  stroke(0);
  strokeWeight(2);
  line(width - 10 - num * s, 30, width - 10, 30);
  strokeWeight(1);
  textAlign(CENTER);
  text(num + 'm', width + 10 - num * s, 25);
  pop();
}

var WorldD = function(g = 9.81, is = true, d = 1.225, v = 0) {
  this.g = g;
  this.is = is;
  this.d = d;
  this.v = v;
}

var ObjMaxD = function(sMin = 0, sMax = 0, hMax = 0, vMax = 0, aMax = 0, tTotal = 0, prec = true) {
  this.sMin = sMin;
  this.sMax = sMax;
  this.hMax = hMax;
  this.vMax = vMax;
  this.aMax = aMax;
  this.tTotal = tTotal;
  this.prec = prec;
}

var ObjGenD = function(m = 1, r = 0.1) {
  this.m = m;
  this.r = r;
}

var ObjShD = function(scale = 1, sV = false, wV = false, tail = false, tSi = 200, tSp = 21, bounceMax = 1) {
  this.dShow = 10;
  this.scale = scale;
  this.sV = sV;
  this.wV = wV;
  this.tail = tail;
  this.tSi = tSi;
  this.tSp = tSp;
  this.bounceMax = bounceMax;
  this.bounce = true;
}

var ObjKinD = function(x = 0, y = 400, vX = 100, vY = 10, t = 0) {
  this.x = x;
  this.y = y;
  this.vX = vX;
  this.vY = vY;
  this.t = t;
}

class Obj {
  constructor(tU) {
    this.gen = new ObjGenD();
    this.kin = new ObjKinD();
    this.sh = new ObjShD();
    this.world = new WorldD();
    this.primary = new ObjKinD(this.kin.x, this.kin.y, this.kin.vX, this.kin.vY);
    this.maxData = new ObjMaxD();
    this.tU = tU;
    this.cPos = 0;
    this.his = [];
    this.his.push(this.primary);
  }

  //SETUP

  showNewData() {
    this.sh.sV = document.getElementById('in-sV').checked;
    this.sh.wV = document.getElementById('in-wV').checked;
    this.sh.tail = document.getElementById('in-tail').checked;
    if (this.sh.tail) {
      this.sh.tSi = Number(document.getElementById('in-tSi').value);
      this.sh.tSp = Number(document.getElementById('in-tSp').value);
    }
    this.cPos--;
    redraw();
  }

  inputNewData() {
    let nums = document.getElementsByClassName('form-numInC');
    let numsV = [];
    for (let num of nums) {
      numsV.push(Number(num.value));
    }
    let units = document.getElementsByClassName('form-select');
    let unitsV = [];
    for (let unit of units) {
      unitsV.push(unit.value);
    }
    let chb = document.getElementsByClassName('form-chbInC');
    this.gen = new ObjGenD(prR(numsV[0] * unitsV[0], 3), prR(numsV[1] * unitsV[1], 3));
    if (document.getElementById('sel-v-type').value == 1) {
      this.primary = new ObjKinD(0, prR(numsV[2] * unitsV[2], 3), prR(numsV[3] * unitsV[3], 3), prR(numsV[4] * unitsV[3], 3));
    }
    else if (document.getElementById('sel-v-type').value == 2) {
      let vX = prR(numsV[3] * unitsV[3] * Math.cos(numsV[4] * document.getElementById('sel-v-2').value * PI / 180), 3);
      let vY = prR(numsV[3] * unitsV[3] * Math.sin(numsV[4] * document.getElementById('sel-v-2').value * PI / 180), 3);
      this.primary = new ObjKinD(0, prR(numsV[2] * unitsV[2], 3), vX, vY);
    }

    if (chb[0].checked) {
      this.world = new WorldD(prR(numsV[5] * unitsV[5], 3), chb[0].checked, prR(numsV[6] * unitsV[6], 3), prR(numsV[7] * unitsV[7], 3));
    }
    else {
      this.world = new WorldD(prR(numsV[5] * unitsV[5], 3), chb[0].checked);
    }
    obj.set();
  }

  inputNewDataMax() {
    let nums = document.getElementsByClassName('form-numInC');
    let numsV = [];
    for (let num of nums) {
      numsV.push(Number(num.value));
    }
    let units = document.getElementsByClassName('form-select');
    let unitsV = [];
    for (let unit of units) {
      unitsV.push(Number(unit.value));
    }
    let chb = document.getElementsByClassName('form-chbInC');
    this.gen = new ObjGenD(prR(numsV[0] * unitsV[0], 3), prR(numsV[1] * unitsV[1], 3));
    if (chb[0].checked) {
      this.world = new WorldD(prR(numsV[5] * unitsV[5], 3), chb[0].checked, prR(numsV[6] * unitsV[6], 3), prR(numsV[7] * unitsV[7], 3));
    }
    else {
      this.world = new WorldD(prR(numsV[5] * unitsV[5], 3), chb[0].checked);
    }
    this.findMax(numsV[2] * unitsV[2], numsV[3] * unitsV[3], unitsV[4]);
    obj.set();
  }

  set() {
    this.resetData();
    this.applyScale();
    tabMUpdate(this);
    tabCUpdate(this, 0);
    pop();
    this.showPath();
    noLoop();
  }

  //TOOLS

  findMax(y, v, step) {
    let max = 0;
    let maxAngle = 0;
    for (var i = 0; i <= 90; i+=step) {
      let vX = prR(v * Math.cos(i * PI / 180), 3);
      let vY = prR(v * Math.sin(i * PI / 180), 3);
      this.primary = new ObjKinD(0, prR(y, 3), vX, vY);
      this.kin.x = this.primary.x;
      this.kin.y = this.primary.y;
      this.kin.vX = this.primary.vX;
      this.kin.vY = this.primary.vY;
      this.sh.bounce = true;
      let m = this.move(true);
      if (m > max) {
        max = m;
        maxAngle = i;
      }
    }
    this.primary = new ObjKinD(0, prR(y, 3), prR(v * Math.cos(maxAngle * PI / 180), 3), prR(v * Math.sin(maxAngle * PI / 180), 3));
  }

  resetData() {
    sPlus = 0;
    time = 0;
    this.sh.bounce = true;
    this.cPos = -1;
    this.maxData = new ObjMaxD();
    this.kin.x = this.primary.x;
    this.kin.y = this.primary.y;
    this.kin.vX = this.primary.vX;
    this.kin.vY = this.primary.vY;
    this.his = [];
    this.his.push(this.primary);
    this.move();
    var slider = select('#scrollingS');
    slider.value(0);
    slider.attribute('max', this.his.length - 1);
  }

  applyScale() {
    var sMin = this.his[this.maxData.sMin].x;
    var sMax = this.his[this.maxData.sMax].x;
    var s = abs(sMax - sMin);
    var hMax = this.his[this.maxData.hMax].y;
    this.sh.scale = (width - 20) / s;
    var a = 0;
    while(a < 2) {
      if (this.sh.scale * hMax + 30 > height) {
        this.sh.scale = (height - 30) / hMax;
      }
      if (this.sh.scale * this.gen.r > 100) {
        this.sh.scale = 100 / this.gen.r;
      }
      this.sh.dShow = (this.gen.r * this.sh.scale > 5)? this.gen.r * 2 : (10 / this.sh.scale);
      if (sMin != 0) {
        sPlus = width - 30 - sMax * this.sh.scale - this.sh.dShow * this.sh.scale / 2;
      }
      else {
        sPlus = this.sh.dShow * this.sh.scale / 2;
        if (a != 1) {
          this.sh.scale = (width - 20 - sPlus) / (s + this.gen.r);
        }
        a++;
      }
    }
  }

  airResistance(v, dir = "x") {
    var a;
    var D;
    if(dir === "x") {
      D = .47 * this.world.d * PI * pow(this.gen.r, 2) * pow(this.world.v - v, 2) / 2;
      var windBigger = (Math.sign(v) === Math.sign(this.world.v) && (abs(this.world.v) - abs(v) >= 0))? true : false;
      var sign = (windBigger)? Math.sign(v) : -Math.sign(v);
      a = D / this.gen.m * sign;
    }
    else {
      D = .47 * this.world.d * PI * pow(this.gen.r, 2) * pow(v, 2) / 2;
      a = -D / this.gen.m * Math.sign(v);
    }
    return a;
  }

  //CALCULATION

  move(max = false) {
    var sMin = 0, posSMin = 0;
    var sMax = 0, posSMax = 0;
    var hMax = this.primary.y, posHMax = 0;
    var vMax = sqrt(pow(this.primary.vX, 2) + pow(this.primary.vY, 2)), posVMax = 0;
    var aMax = 0, posAMax = 0;
    while (this.sh.bounce) {
      var aX = 0, aY = -this.world.g;
      if (this.world.is) {
        if (abs(this.airResistance(this.kin.vX) * this.tU) > abs(this.world.v - this.kin.vX)) {
          aX = -abs(this.world.v - this.kin.vX) / this.tU;
          this.maxData.prec = false;
        }
        else {
          aX = this.airResistance(this.kin.vX);
        }
        if (abs(this.airResistance(this.kin.vY, "y") * this.tU) > abs(this.kin.vY)) {
          aY = -abs(this.kin.vX) / this.tU;
          this.maxData.prec = false;
        }
        else {
          aY = -this.world.g + this.airResistance(this.kin.vY, "y");
        }
      }

      time += this.tU;
      this.kin.x += this.kin.vX * this.tU + 1/2 * aX * pow(this.tU, 2);
      this.kin.y += this.kin.vY * this.tU + 1/2 * aY * pow(this.tU, 2);
      this.kin.vX += aX * this.tU;
      this.kin.vY += aY * this.tU;

      //LOOKING FOR HMAX

      if (!max && hMax < this.kin.y) {
        hMax = this.kin.y;
        posHMax = this.his.length;
      }

      //LOOKING FOR VMAX

      if (!max && vMax < sqrt(pow(this.kin.vX, 2) + pow(this.kin.vY, 2))) {
        vMax = sqrt(pow(this.kin.vX, 2) + pow(this.kin.vY, 2));
        posVMax = this.his.length;
      }

      //LOOKING FOR AMAX

      if (!max && aMax < sqrt(pow(aX, 2) + pow(aY, 2))) {
        aMax = sqrt(pow(aX, 2) + pow(aY, 2));
        posAMax = this.his.length;
      }

      //LOOKING FOR SMAX & SMIN

      if (!max && sMin > this.kin.x) {
        sMin = this.kin.x;
        posSMin = this.his.length;
      }
      if (sMax < this.kin.x) {
        sMax = this.kin.x;
        if(!max) {
          posSMax = this.his.length;
        }
      }

      //COLLISION DETECTION

      if (this.kin.y - this.gen.r < 0) {
        this.kin.y = this.gen.r;
        this.sh.bounce = false;
      }

      //SAVING DATA
      if (!max) {
        var data = new ObjKinD(prR(this.kin.x), prR(this.kin.y), prR(this.kin.vX), prR(this.kin.vY), prR(time, 3));
        this.his.push(data);
      }
    }
    if (!max) {
      this.maxData.sMin = posSMin;
      this.maxData.sMax = posSMax;
      this.maxData.hMax = posHMax;
      this.maxData.vMax = posVMax;
      this.maxData.aMax = posAMax;
      this.maxData.tTotal = time;
    }
    else {
      return sMax;
    }
  }

  //PRESENTING data

  showPath() {
    this.backgroundSky();
    division(this.sh.scale);
    push();
    noStroke();
    fill('#222');
    rect(0, height - 20, width, 20);
    translate(10 + sPlus, height - 20);
    scale(this.sh.scale, -this.sh.scale);
    fill('#3A3');
    ellipse(this.primary.x, this.primary.y, this.sh.dShow);
    fill('#A33');
    ellipse(this.his[this.his.length - 1].x, this.his[this.his.length - 1].y, this.sh.dShow);
    noFill();
    stroke('#333');
    strokeWeight(3 / this.sh.scale);

    beginShape();
    for (var obj of this.his) {
      vertex(obj.x, obj.y);
    }
    endShape();
    pop();
  }

  backgroundSky() {
    colorMode(HSL);
    var a = map(this.his[this.maxData.hMax].y, 0, 3000, 90, 40);
    for (let i = 0; i <= 0 + height; i++) {
      let l = map(i, 0, 0 + height, a, 90);
      let c = color(210, 80, l);
      stroke(c);
      line(0, i, 0 + width, i);
    }
  }

  show() {
    var lPos;
    var obj;

    //PREPERATION
    this.backgroundSky();
    division(this.sh.scale);
    noStroke();
    fill('#222');
    rect(0, height - 20, width, 20);
    push();
    translate(10 + sPlus, height - 20);
    scale(this.sh.scale, -this.sh.scale);

    //STOPPING THE ANIMATION
    if (this.cPos >= this.his.length - 1) {
      pop();
      this.showPath();
      noLoop();
    }
    else if (this.cPos === -1) {
      pop();
      this.showPath();
      this.cPos++;
    }
    else {
      this.cPos++;

      //PRIMARY POS
      noStroke();
      fill('#3A3');
      ellipse(this.primary.x, this.primary.y, this.sh.dShow);

      //CURRANT POS & TAIL
      if (this.sh.tail) {
        if (this.cPos <= this.sh.tSi) {
          lPos = 0;
        }
        else {
          lPos = this.cPos - this.sh.tSi;
        }
        for (var i = this.cPos; i >= lPos ; i -= this.sh.tSp) {
          var size = map(i, this.cPos + 1, lPos, this.sh.dShow, this.sh.dShow / 5);
          var color = map(i, this.cPos + 1, lPos, 50, 150);
          fill(color);
          ellipse(this.his[i].x, this.his[i].y, size);
        }
      }
      let ob = this.his[this.cPos];
      fill(0);
      ellipse(ob.x, ob.y, this.sh.dShow);

      //VELOCITY VECTORS
      if (this.sh.sV) {
        push();
        strokeWeight(3 / this.sh.scale);
        stroke('#A33');
        line(ob.x, ob.y, ob.x + ob.vX, ob.y);
        line(ob.x, ob.y, ob.x, ob.y + ob.vY);
        pop();
      }
      if (this.sh.wV) {
        push();
        strokeWeight(3 / this.sh.scale);
        stroke('#33A');
        line(ob.x, ob.y - 3 / this.sh.scale, ob.x + this.world.v, ob.y - 3 / this.sh.scale);
        pop();
      }
    }
    var slider = select('#scrollingS');
    slider.value(this.cPos);
    if (whichDivOut === 'Table') {
      if ((this.cPos%30 === 0 && running ) || !running) {
        tabCUpdate(this, this.cPos);
      }
    }
  }
}
