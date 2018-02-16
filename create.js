import Geometry from './polygons';
/*
var JSON = {
  render:{
    element: "#grapher",
    width: 1600,
    height: 1600,
    grid: true
  },
  type: "2D",
  functions: {
    regular: [
      {
        sides: 5,
        center: {
          x: 55,
          y: 15
        },
        radius: 8,
        rotation: 45,
        color: "brown",
        decorate:{
          intCircle: "blue",
          drawDimension: {
            color: "black",
            dimensions: [
              [1, 2]
            ],
            distance: [3]
          }
        }
      },
      {
        sides: 6,
        center: {
          x: 85,
          y: 65
        },
        radius: 8,
        rotation: 45,
        color: "brown",
        decorate:{
          extCircle: "blue",
          drawDimension: {
            color: "black",
            dimensions: [
              [0, 1],
              [3, 0]
            ],
            distance: [3, 10]
          }
        }
      }
    ],
    irregularByEdges: [
      {
        firstPoint: {
          x: 15,
          y: 15
        },
        edges: [5, 5, 5],
        angles: [90, 90],
        color: "purple"
      }
    ],
    irregularByPoints: [
      {
        points: [
          {x:80, y:15},
          {x:100, y:15},
          {x:100, y:35},
          {x:80, y:35},
          {x:80, y:15}
        ],
        rotation: 45,
        color: "red"
      }
    ],
    circle:[
      {
        center: {
          x: 50,
          y:50
        },
        radius: 4,
        color: "orange"
      }
    ]
  }
}
*/

const draw = function (specs) {
  console.log('Starting...', specs);
  var render = specs.render;
  var methods = specs.functions;
  if(specs.type == "2D"){
    var DOM = new Geometry(render.element, render.width, render.height);
    if(render.grid){
      DOM.grid();
    }
    if(methods.regular){
      for(var i=0; i<methods.regular.length; i++){
        var data = methods.regular[i];
        var points = DOM.regular(data.sides, data.center, data.radius, data.rotation, data.color);
        if(data.decorate){
          var options = data.decorate;
          decorate(DOM, points, options);
        }
      }
    }
    if(methods.irregularByEdges){
      for(var i=0; i<methods.irregularByEdges.length; i++){
        var data = methods.irregularByEdges[i];
        var points = DOM.irregularByEdges(data.firstPoint, data.edges, data.angles, data.color);
      }
    }
    if(methods.irregularByPoints){
      for(var i=0; i<methods.irregularByPoints.length; i++){
        var data = methods.irregularByPoints[i];
        var points = DOM.irregularByPoints(data.points, data.rotation, data.color);
      }
    }
    if(methods.circle){
      for(var i=0; i<methods.circle.length; i++){
        var data = methods.circle[i];
        DOM.circle(data.center, data.radius, "Normal", data.color);
      }
    }
  }
}

function decorate(DOM, points, options){
  if(options.intCircle){
    DOM.decorate.intCircle(points, options.intCircle);
  }
  if(options.extCircle){
    DOM.decorate.extCircle(points, options.extCircle);
  }
  if(options.drawDimension){
    /*Draw all*/
    var dimOptions = options.drawDimension;
    if(dimOptions.dimensions == "all"){
      for(var i=0; i<points.length-1; i++){
        DOM.decorate.drawDimension(points[i], points[i+1], "bla", dimOptions.color, dimOptions.distance);
      }
    }else if(dimOptions.dimensions){
      var dimPoints;
      for(var i = 0; i<dimOptions.dimensions.length; i++){
        dimPoints = dimOptions.dimensions[i];
        //DOM.decorate.drawDimension(dimPoints[0], dimPoints[1], "bla", dimOptions.color, dimOptions.distance[i]);
        DOM.decorate.drawDimension(points[dimPoints[0]], points[dimPoints[1]], "bla", dimOptions.color, dimOptions.distance[i]);
      }
    }
  }
}

export default draw;
