import General from './general';

const Geometry = function (divName, width, height) {
  const general = new General();
  const svg = d3.select(divName).append('svg').attr('width', width).attr('height', height);
  const line = d3.line().x(function(d) { return (d.x)*10; }).y(function(d) { return (d.y)*10; });
  const arc = d3.arc().innerRadius(0).outerRadius(15);
  const trace = d3.arc();
  const greek = ['\u03B1', '\u03B2', '\u03B3', '\u03B4', '\u03B5', '\u03B6', '\u03B7',
    '\u03B8', '\u03B9', '\u03C0', '\u03C1', '\u03C2', '\u03C3', '\u03C4',
    '\u03C5', '\u03C6', '\u03C7', '\u03C8', '\u03C9'];
  let nPolygon=0;


  function drawGrid(){
    var drawing = 0;
    while(drawing<width+1){
      svg.append('line')
        .attr('class', 'grid')
        .attr('x1', drawing)
        .attr('y1', 0)
        .attr('x2', drawing)
        .attr('y2', height)
        .style("stroke", "#d9dde2")
        .style("stroke-width", "1");
      drawing+=10;
    }
    drawing = 0;
    while(drawing<width+1){
      svg.append('line')
        .attr('class', 'grid')
        .attr('x1', 0)
        .attr('y1', drawing)
        .attr('x2', width)
        .attr('y2', drawing)
        .style("stroke", "#d9dde2")
        .style("stroke-width", "1");
      drawing+=10;
    }
  }
  /*CREATE*/
  function createRegular(numEdges, center, radius, rotateAngle=0, render="black"){
    var angle = 360 / numEdges;
    if(!center.x || !center.y){
      console.log('The center is not defined. (X,Y)');
      return false;
    };
    var x = center.x + radius;
    var y = center.y;
    var first = {x, y};
    //First Point
    var points = [first];

    /*Create all vertex*/
    for(var i=0; i< numEdges; i++) {
      points.push(general.rotateLine(center, points[i], angle));
    }
    if(!isNaN(rotateAngle)){
      for(var p = 0; p<points.length; p++){
        points[p] = general.rotateLine(center, points[p], rotateAngle)
      }
    }
    /*Draw edges*/
    if(render){
      svg.append('path').attr('d', line(points))
        .attr("fill", 'none')
        .attr('stroke', render)
        .attr('stroke-width', '3');
    }
    return points;
  }
  function createIrregularByPoints(points, rotateAngle=0, render="black") {
    svg.append('path').attr('d', line(points))
      .attr("fill", 'none')
      .attr('stroke', render)
      .attr('stroke-width', '3');
    return points;
  }
  function createIrregularByEdges(initPoint, edgesLenghts, angles, render = "black"){
    if(!(edgesLenghts.length>2) || !(angles.length>1) || (edgesLenghts.length - angles.length)!=1){
      console.error('Bad parameters in edges or angles');
      return false;
    }
    if(!initPoint.x || !initPoint.y){
      console.error('First point not assign (X, Y)');
      return false;
    }
    var points=[initPoint];
    points.push({x:initPoint.x, y:initPoint.y+edgesLenghts[0]});
    for(var j=1;j<edgesLenghts.length;j++){
      var newPoint = general.rotateLine(points[j], points[j-1], -angles[j-1]);
      points.push(newPoint);
      var unitVector = general.unitVector(points[j], points[j+1], 1);
      points[j+1]={x:points[j].x+(unitVector.x*edgesLenghts[j]), y:points[j].y+(unitVector.y*edgesLenghts[j])}
    }
    points.push(points[0]);
    if(render){
      for(var i=0;i<points.length-1;i++){
        svg.append('line')
          .attr('class', 'irregular2')
          .attr('x1', points[i].x*10)
          .attr('y1', points[i].y*10)
          .attr('x2', points[i+1].x*10)
          .attr('y2', points[i+1].y*10)
          .style("stroke", render)
          .style("stroke-width", "3");
      }
    }
    return points;
  }
  function createCircle(center, radius, circleName, render="black") {
    //d3.selectAll('circle.poly').remove();
    d3.selectAll('line.radius').remove();
    svg.selectAll('circle.'+circleName).data([center]).enter().append('circle')
      .attr('class', circleName)
      .attr('cx', function(d) {return (d.x*10);})
      .attr('cy', function(d) {return (d.y*10);})
      .attr('r', radius*10)
      .style("stroke", render)
      .style("stroke-width", "3")
      .style("fill", "transparent");
  }
  function createAngle(center, degress, length, color, rotation, drawAngle, angleText) {
    length *=10;
    center.x*=10;
    center.y*=10;
    if(drawAngle===undefined){
      drawAngle=true;
    }
    if(angleText===undefined){
      angleText=true;
    }
    if(rotation===undefined){
      rotation = 0;
    }else{
      rotation *= Math.PI/180;
    }
    var points = [center];
    var bisPoint = {
      x: general.roundTo(points[0].x+(length*Math.cos(rotation)),2),
      y: general.roundTo(points[0].y+(length*Math.sin(rotation)),2)
    };
    points.push(general.rotateLine(points[0], bisPoint, degress/2 ));
    points.push(general.rotateLine(points[0], bisPoint, -degress/2 ));
    var n= nPolygon;
    svg.selectAll('line.angle'+ n++).data(points).enter().append('line')
      .attr('class', 'angle'+n++)
      .attr('x1', function(d, i){if(i>0){return points[0].x;}}).attr('y1', function(d, i){if(i>0){return points[0].y;}})
      .attr('x2', function(d, i){if(i>0){return points[i].x;}}).attr('y2', function(d, i){if(i>0){return points[i].y;}})
      .style("stroke", "black").style("stroke-width", "3");
    if(drawAngle){
      var angle = {
        startAngle: (-(degress/2)+90)*Math.PI/180,
        endAngle:   ((degress/2)+90)*Math.PI/180
      }
      var arc2 = d3.arc().innerRadius(0).outerRadius(length/3);
      svg.append('path').attr('d', arc2(angle))
        .attr('class', 'angle').attr('stroke', 'black').attr('stroke-width', '1')
        .attr('fill', color)
        .attr("transform", function() {
          return "translate("+points[0].x+","+points[0].y+")rotate("+(rotation*180/Math.PI)+")";
        });
    }
    if(typeof angleText === 'string' || typeof angleText === 'boolean'){
      svg.selectAll('text.angle1').data([degress]).enter().append('text')
        .attr('class', 'angle1')
        .attr('x', function(){
          return (points[0].x-(10)+(length*Math.cos(rotation)));
        })
        .attr('y', function(){return points[0].y+5+(length * Math.sin(rotation));})
        .text(function(){
          if(angleText === true){
            return degress+'°';
          }else if(angleText !== false){
            return angleText;
          }
        });
    }
  }
  /*DECORATE*/
  function intCircle(points, render="black") {
    var A, B, C;
    A = {x: (points[0].x + points[1].x)/2, y: (points[0].y + points[1].y)/2};
    B = {x: (points[1].x + points[2].x)/2, y: (points[1].y + points[2].y)/2};
    C = {x: (points[2].x + points[3].x)/2, y: (points[2].y + points[3].y)/2};
    var centerInt = general.findCenter(A,B,C);
    var radiusInt = general.distance(centerInt, A);
    createCircle(centerInt, radiusInt, "internalCircle", render);
  }
  function extCircle(points, render="black") {
    var centerExt = general.findCenter(points[0], points[1], points[2]);
    var radiusExt = general.distance(centerExt, points[1]);
    createCircle(centerExt, radiusExt, "externalCircle", render);
  }
  function drawDimension(p1, p2, label, render="blue", distance) {

    var A, B, slop;
    slop = general.rotateLine(p1,p2, 90);
    slop.x = general.roundTo((p1.x-slop.x)/general.distance(p2, p1), 2);
    slop.y = general.roundTo((p1.y-slop.y)/general.distance(p2, p1), 2);
    A = {x:general.roundTo(p1.x+slop.x*distance, 2), y:general.roundTo(p1.y+slop.y*distance, 2)};
    B = {x:general.roundTo(p2.x+slop.x*distance, 2), y:general.roundTo(p2.y+slop.y*distance, 2)};

    const A_up = {x:A.x+slop.x, y:A.y+slop.y};
    const A_down = {x:A.x-slop.x, y:A.y-slop.y};
    const B_up = {x:B.x+slop.x, y:B.y+slop.y};
    const B_down = {x:B.x-slop.x, y:B.y-slop.y};
    //DIMENSIONS LINES
    svg.append('line')
      .attr('x1', A.x*10)
      .attr('y1', A.y*10)
      .attr('x2', B.x*10)
      .attr('y2', B.y*10)
      .style("stroke", render)
      .style("stroke-width", "2");
    svg.append('line')
      .attr('x1', A_up.x*10)
      .attr('y1', A_up.y*10)
      .attr('x2', A_down.x*10)
      .attr('y2', A_down.y*10)
      .style("stroke", render)
      .style("stroke-width", "2");
    svg.append('line')
      .attr('x1', B_up.x*10)
      .attr('y1', B_up.y*10)
      .attr('x2', B_down.x*10)
      .attr('y2', B_down.y*10)
      .style("stroke", render)
      .style("stroke-width", "2");
    //TEXT
    const text_coord = {x: (A.x+B.x)/2, y: (A.y+B.y)/2}
    const textAngle = general.angleBtwn(text_coord,
      B,
      {x:text_coord.x+10, y:text_coord.y});
    text_coord.x += slop.x;
    text_coord.y += slop.y;
    if(label.includes("dst")){
      label = general.distance(p1, p2) + label.slice(3,label.length);
    }
    svg.append('text')
      .attr('class', 'angle')
      .text(label)
      .attr('text-anchor', 'middle')
      .attr("dy", ".35em")
      .attr("transform",
        "translate("+
        text_coord.x*10+","+
        text_coord.y*10+")rotate("+(-textAngle-180)+")");
  }
  function angleText(points, distance, colors, display, base) {
    base="°";
    if(display===undefined){
      display=[];
      for(var i=0;i<distance.length; i++){
        display.push("number");
      }
    }
    /*Check angle array*/
    var char = 0;
    if(distance===undefined){
      distance=[];
      for(var i = 0; i<points.length-1; i++){
        distance.push(1);
      }
    }
    if(distance === false){
      distance=[];
      for(var i = 0; i<points.length-1; i++){
        distance.push(0);
      }
    }
    if(colors === undefined){
      for(var i = 0; i<points.length-1; i++){
        color.push('red');
      }
    }else if(typeof(colors) === 'string'){
      var defaultColor = colors;
      colors=[];
      for(var i = 0; i<points.length-1; i++){
        colors.push(defaultColor);
      }
    }
    /*Initialization*/
    var angleData=[];
    var vectors = [];
    var angles = [];
    /*Unit vectors for position*/
    for(var i=0; i<points.length-1; i++){
      var p1 = points[i-1];
      var p2 = points[i];
      var p3 = points[i+1];
      if (p1 === undefined){
        p1 = points[points.length-2];
      }
      var angle = general.angleBtwn(p2, p1, p3);
      angles.push(angle);
      var vector = general.unitVector(p2, general.rotateLine(p2, p1, -(angle)/2), 1);
      vectors.push(vector);
    }
    /*Finding first angle. The point order must be anticlockwize*/
    var origin = {x:points[0].x, y:points[0].y-20};
    var actualAngle = general.angleBtwn(points[0], origin, points[points.length-2]);
    d3.selectAll('path.angle'+nPolygon).remove()
    for (var i=0; i<points.length-1; i++){
      origin = {x:points[i].x, y:points[i].y-20};
      var p1 = {x:points[i].x, y:points[i].y-20};
      var p2 = points[i-1];
      if(p2===undefined){
        p2=points[points.length-2];
      }
      var actualAngle = general.angleBtwn(points[i], origin, p2);
      if(actualAngle>180){
        actualAngle-=360;
      }
      var data = {startAngle: general.toRadians(actualAngle), endAngle: general.toRadians(actualAngle+angles[i])};
      //actualAngle+=180;

      var pathData = arc(data);
      svg.append('path').attr('d', pathData)
        .attr('class', 'angle'+nPolygon++)
        .attr("fill", function(){
          if(colors[i]===undefined){
            return 'red';
          }
          return colors[i];
        })
        .attr('stroke', 'black')
        .attr('stroke-width', '3')
        .attr("transform", function() {
          return "translate("+points[i].x*10+","+points[i].y*10+")";
        });
    }
    var textBox = [], text;
    var offset;
    for(i = 0; i<points.length-1; i++){
      if(display[i]){
        offset = 4;
        if(distance[i]!=0){
          offset+=distance[i];
        }
        if(base==='hex'){
          text = general.toMS(angles[i]);
        }else{
          text = angles[i]+'°';
        }
        if(display[i]==='variable'){
          text = greek[i];
        }else if(display[i]==='both'){
          text =  greek[i]+' = '+text;
        }

        var dimensions = general.wordDimensions(text);
        var width = dimensions.width/20+.2;
        var height = dimensions.height;
        textBox.push({x:points[i].x-width+vectors[i].x*offset, y:points[i].y+1+vectors[i].y*offset});
        textBox.push({x:points[i].x-width+vectors[i].x*offset, y:points[i].y-1+vectors[i].y*offset});
        textBox.push({x:points[i].x+width+vectors[i].x*offset, y:points[i].y-1+vectors[i].y*offset});
        textBox.push({x:points[i].x+width+vectors[i].x*offset, y:points[i].y+1+vectors[i].y*offset});
        textBox.push({x:points[i].x-width+vectors[i].x*offset, y:points[i].y+1+vectors[i].y*offset});
        textBox.push({x:points[i].x-width+vectors[i].x*offset, y:points[i].y-1+vectors[i].y*offset});
        if(distance[i]){
          svg.append("path")
            .attr("d", line(textBox))
            .attr('stroke-width','5px')
            .attr('stroke-linejoin','round')
            .attr('stroke', '#e3e7ed')
            .attr("fill", "#e3e7ed");

        }
        textBox=[];
      }

    }
    svg.selectAll('text.angle'+nPolygon).data(points).enter().append('text')
      .attr('class', 'angle'+nPolygon++)
      .attr('x', (d, i)=>{
        offset = 4;
        if(distance[i]!=0){
          offset+=distance[i];
        }
        if(i<points.length-1&&display[i]){
          var fixedWidth, text;

          if(base==='hex'){
            text = general.toMS(angles[i]);
          }else{
            text = angles[i]+'°';
          }
          if(display[i]==='variable'){
            text = greek[i];
          }else if(display[i]==='both'){
            text =  greek[i]+' = '+text;
          }
          var dimensions = general.wordDimensions(text);
          fixedWidth=dimensions.width/2;
          return (d.x+vectors[i].x*offset-(fixedWidth/10))*10;
        }
      })
      .attr('y', (d, i)=>{
        offset = 4;
        if(distance[i]){
          offset+=distance[i];
        }
        if(i<points.length-1&&display[i]){
          var fixedWidth, text;

          if(display.base==='hex'){
            text = general.toMS(angles[i]);
          }else{
            text = angles[i]+'°';
          }
          var dimensions = general.wordDimensions(text);
          fixedWidth=dimensions.height/2-4;
          return (d.y+vectors[i].y*offset+(fixedWidth/10))*10;
        }
      })
      .text((d, i)=>{
        if(i<points.length-1&&distance[i]!=0){
          var text;
          if(display.base==='hex'){
            text = general.toMS(angles[i]);
          }else{
            text = angles[i]+'°';
          }
          if(display[i]==='number'){
            return text;
          }else if(display[i]==='variable'){
            return greek[i];
          }else if(display[i]==='both'){
            return greek[i]+' = '+text;
          }
        }
      });
    return angles;
  }
  function drawBisector(points, sides) {
    var p1, p2, p3, p4, center, rPoint, center1, p1Rotated, vec1, abs, line1, line2;
    angles = calculateAngles(points);
    var distanceTrace, rotateAngle=angles[0]/2-90;
    var angle = 0, angleX;
    for(var i=0;i<points.length-1;i++) {
      p1Rotated = general.rotateLine(points[i], points[i+1], angles[i]/2)
      vec1 = {x: p1Rotated.x -points[i].x, y: p1Rotated.y -points[i].y};
      abs = Math.sqrt(Math.pow(vec1.x, 2) + Math.pow(vec1.y, 2));
      vec1.x *= 1/abs;
      vec1.y *= 1/abs;

      svg.append('line')
        .attr('x1', (points[i].x*10)-(vec1.x*100))
        .attr('y1', (points[i].y*10)-(vec1.y*100))
        .attr('x2', (points[i].x*10)+(vec1.x*100))
        .attr('y2', (points[i].y*10)+(vec1.y*100))
        .style("stroke", "gray")
        .style("stroke-width", "2");
      /*Drawing Process*/
      svg.selectAll('circle.bisector').data(points).enter().append('circle')
        .attr('class', 'bisector')
        .attr('cx', function(d) {return (d.x*10);})
        .attr('cy', function(d) {return (d.y*10);})
        .attr('r', ()=>{
          p1 = points[i];
          p2 = points[i-1];
          p3 = points[i];
          p4 = points[i+1];
          if(p2===undefined){
            p2=points[points.length-2]
          }
          var d1 = general.distance(p1, p2);
          var d2 = general.distance(p3, p4);
          distanceTrace = (d1+d2)*.6
          return distanceTrace;
        })
        .attr("stroke", "black")
        .attr('stroke-width', '2')
        .attr('fill', 'transparent');
      line1 = general.unitVector(points[i], points[i+1], distanceTrace/10);
      line2 = general.unitVector(points[i+1], points[i], distanceTrace/10);
      svg.append('circle')
        .attr('class', 'bisector')
        .attr('cx', function() {return (points[i].x+(line1.x))*10;})
        .attr('cy', function() {return (points[i].y+line1.y)*10;})
        .attr('r', 4)
      svg.append('circle')
        .attr('class', 'bisector')
        .attr('cx', function() {return (points[i+1].x+(line2.x))*10;})
        .attr('cy', function() {return (points[i+1].y+line2.y)*10;})
        .attr('r', 4);
      /**/
      var angleData = {
        startAngle: 0,
        endAngle: Math.PI,
        innerRadius: 30,
        outerRadius: 30
      };
      angle += 0;
      if(i>0){
        angleX = general.angleBtwn(points[i], points[i-1], {x:points[i].x+50, y:points[i].y});
        line2 = general.unitVector(points[i], points[i-1], distanceTrace/10);

      }else{
        angleX = general.angleBtwn(points[i],
          points[points.length-2],
          {x:points[i].x+10, y:points[i].y});
        line2 = general.unitVector(points[i], points[points.length-2], distanceTrace/10);
      }
      if(isNaN(angleX)){
        angleX=180;
      }
      angle = angleX - angles[i]/2 + 90;
      //console.log({x:points[i].x+10, y:points[i].y})
      svg.append('path')
        .attr('d', trace(angleData))
        .attr('class', 'bisector')
        .attr('fill', 'transparent')
        .attr('stroke', 'red')
        .attr('stroke-width', '2')
        .style("stroke-dasharray", ("2, 3"))
        .attr("transform", (d) =>{
          return "translate("+((points[i].x+(line1.x))*10)+","+((points[i].y+line1.y)*10)+")rotate("+(-angle)+")";
        });
      svg.append('path')
        .attr('d', trace(angleData))
        .attr('class', 'bisector')
        .attr('fill', 'transparent')
        .attr('stroke', 'red')
        .attr('stroke-width', '2')
        .style("stroke-dasharray", ("2, 3"))
        .attr("transform", (d) =>{
          translate = general.roundTo((points[i].x+(line2.x))*10, 2)+","+
            general.roundTo((points[i].y+line2.y)*10, 2);
          return "translate("+translate+
            ")rotate("+(-angle+180)+")";
        });
    }
  }
  function calculateAngles(points){
    var angleData=[];
    var vectors = [];
    var angles = [];
    /*Unit vectors for position*/
    for(var i=0; i<points.length-1; i++){
      var p1 = points[i-1];
      var p2 = points[i];
      var p3 = points[i+1];
      if (p1 === undefined){
        p1 = points[points.length-2];
      }
      var angle = general.angleBtwn(p2, p1, p3);
      angles.push(angle);
      var vector = general.unitVector(p2, general.rotateLine(p2, p1, -(angle)/2), 1);
      vectors.push(vector);
    }
    return angles;
  }
  function drawPerBis(points){
    /*Perpendicular bisector*/
    var midPoint, p1, p2, p3, angleCorrection, angleData;
    var rotatedAngle =0;
    for(var i=0; i<points.length-1;i++){
      midPoint = {x:general.roundTo((points[i].x+points[i+1].x)/2, 4), y:general.roundTo((points[i].y+points[i+1].y)/2, 4)};
      /*Error here*/
      var perBis = general.rotateLine(midPoint, points[i+1],90);
      var abs = Math.sqrt(Math.pow(perBis.x-midPoint.x, 2)+Math.pow(perBis.y-midPoint.y, 2));
      var vec1 = {x:general.roundTo((perBis.x-midPoint.x)/abs,4), y:general.roundTo((perBis.y-midPoint.y)/abs,4)};
      svg.append('line')
        .attr('x1', (midPoint.x*10)-(vec1.x*100))
        .attr('y1', (midPoint.y*10)-(vec1.y*100))
        .attr('x2', (midPoint.x*10)+(vec1.x*100))
        .attr('y2', (midPoint.y*10)+(vec1.y*100))
        .style("stroke", "blue")
        .style("stroke-width", "2");
      p1=points[i-1];
      p2=points[i];
      p3=p1;
      p3=points[i+1];
      if(p1===undefined){
        p1=p3;
      }
      var dp =(p1.x - p2.x)*(p3.x - p2.x) + (p1.y - p2.y)*(p3.y - p2.y);
      var absDP = Math.pow(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2),0.5)*
        Math.pow(Math.pow(p3.x-p2.x,2)+Math.pow(p3.y-p2.y,2),0.5);
      var angle = Math.acos(dp/absDP);
      angle *= 180/Math.PI;
      if(i===0){
        angle = 0;
      }
      if(i%2==0){
        angleCorrection = 0;
      }else{
        angleCorrection = 180;
      }
      var radius = general.distance(points[i], points[i+1])*6

      rotatedAngle += angle;

      if(i>=0){
        angleData = {
          startAngle: Math.PI/4,
          endAngle: -Math.PI/4,
          innerRadius: radius/2,
          outerRadius: radius/2
        };
        var pathData = trace(angleData);
        svg.append('path').attr('d', pathData)
          .attr('class', 'trace')
          .attr('stroke', 'purple')
          .attr('stroke-width', '3')
          .style("stroke-dasharray", ("3, 3"))
          .attr("transform", function() {
            return "translate("+((((points[i].x+points[i+1].x)/2)+points[i+1].x)/2)*10+","
              +((((points[i].y+points[i+1].y)/2)+points[i+1].y)/2)*10+")rotate("+(rotatedAngle+angleCorrection)+")";
          });
        angleData = {
          startAngle: -Math.PI*0.75,
          endAngle: -Math.PI*1.25,
          innerRadius: radius/2,
          outerRadius: radius/2
        };
        var pathData = trace(angleData);
        svg.append('path').attr('d', pathData)
          .attr('class', 'trace')
          .attr('stroke', 'purple')
          .attr('stroke-width', '3')
          .style("stroke-dasharray", ("3, 3"))
          .attr("transform", function() {
            return "translate("+((((points[i].x+points[i+1].x)/2)+points[i].x)/2)*10+","
              +((((points[i].y+points[i+1].y)/2)+points[i].y)/2)*10+")rotate("+(rotatedAngle+angleCorrection)+")";
          });}
    }
  }
  return{
    regular: createRegular,
    irregularByPoints: createIrregularByPoints,
    irregularByEdges: createIrregularByEdges,
    circle: createCircle,
    angle: createAngle,
    decorate:{
      intCircle: intCircle,
      extCircle: extCircle,
      drawDimension: drawDimension,
      intAngles: angleText,
      bisector: drawBisector,
      perBis: drawPerBis
    },
    grid: drawGrid
  }
};

export default Geometry;
