const General = function () {
  function rotateLine(center, point, angle) {
    let radians = toRadians(angle),
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
      ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;
    return {x: roundTo(nx, 3), y: roundTo(ny, 3)};
  }
  function roundTo(number, nDecimals) {
    return parseFloat(number.toFixed(nDecimals));
  }
  function toRadians(degress){
    return (Math.PI / 180) * degress;
  }
  function toDegress(radians) {
    return (180 / Math.PI) * radians;
  }
  function unitVector(p1, p2, magnitude=1) {
    var vector = {x:p2.x-p1.x, y:p2.y-p1.y};
    var abs = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    vector.x = roundTo(vector.x/abs,4);
    vector.y = roundTo(vector.y/abs,4);
    if (magnitude>1){
      vector.x *= magnitude;
      vector.y *= magnitude;
    }
    return vector;
  }
  function findCenter(A,B,C){
    var aSlope, bSlope, center;
    var xDelta_a = 1, yDelta_a;
    var xDelta_b = 1, yDelta_b;
    const AB_ = {x:(B.x + A.x) / 2, y:(B.y + A.y) / 2};
    const BC_ = {x:(C.x + B.x) / 2, y:(C.y + B.y) / 2};
    center = {x:0, y:0};
    const slp_AB = -1/((B.y - A.y) / (B.x - A.x));
    const slp_BC = -1/((C.y - B.y) / (C.x - B.x));
    if(Math.abs(slp_AB) == Infinity){
      center.x = AB_.x;
      center.y = slp_BC * (center.x - BC_.x) + BC_.y;
    }else if(Math.abs(slp_BC) == Infinity){
      center.x = BC_.x;
      center.y = slp_AB * (center.x - AB_.x) + AB_.y;
    }else{
      center.x = (BC_.y - AB_.y + slp_AB*AB_.x - slp_BC*BC_.x)/(slp_AB-slp_BC);
      center.y = slp_AB * (center.x - AB_.x) + AB_.y;
    }
    return center;
  }
  function distance(p1,p2){
    return roundTo(Math.sqrt((Math.pow(p2.x-p1.x,2))+(Math.pow(p2.y-p1.y,2))), 4)
  }
  function vectorAbs(line) {
    return Math.sqrt(Math.pow(line.x, 2)+Math.pow(line.y, 2))
  }
  function angleBtwn(center, p1, p2) {
    var dot = (p1.x - center.x)*(p2.x - center.x) + (p1.y - center.y)*(p2.y - center.y);
    var line1 = {x: roundTo(p1.x - center.x, 4), y: roundTo(p1.y - center.y,4)}
    var line2 = {x: roundTo(p2.x - center.x, 4), y: roundTo(p2.y - center.y,4)}
    var abs = vectorAbs(line1)*vectorAbs(line2);
    var angle = Math.acos(dot/abs);
    angle = roundTo(toDegress(angle), 2);
    var crossZ = (p1.x-center.x)*(p2.y-center.y)-(p1.y-center.y)*(p2.x-center.x)
    if(crossZ<0){
      return 360-angle
    }
    return angle;
  }
  function wordDimensions(text, classes, escape) {
    classes = classes || [];

    if (escape === undefined) {
      escape = true;
    }

    classes.push('textDimensionCalculation');

    var div = document.createElement('div');
    div.setAttribute('class', classes.join(' '));

    if (escape) {
      $(div).text(text);
    } else {number
      div.innerHTML = text;
    }

    document.body.appendChild(div);

    var dimensions = {
      width : jQuery(div).outerWidth(),
      height : jQuery(div).outerHeight()
    };

    div.parentNode.removeChild(div);

    return dimensions;
  };
  return {
    rotateLine: rotateLine,
    roundTo: roundTo,
    toRadians: toRadians,
    unitVector: unitVector,
    findCenter: findCenter,
    distance: distance,
    angleBtwn: angleBtwn,
    wordDimensions: wordDimensions
  }
};

export default General;
