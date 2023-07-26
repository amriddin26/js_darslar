function filterNodesById(nodes,id){
			return nodes.filter(function(n) { return n.id === id; });
		}
		
		function filterNodesByType(nodes,value){
			return nodes.filter(function(n) { return n.type === value; });
		}
		
		function triplesToGraph(triples){
		
			svg.html("");
			//Graph
			var graph={nodes:[], links:[], triples:[]};
			
			//Initial Graph from triples
			triples.forEach(function(triple){
				var subjId = triple.subject;
				var predId = triple.predicate;
				var objId = triple.object;
				
				var subjNode = filterNodesById(graph.nodes, subjId)[0];
				var objNode  = filterNodesById(graph.nodes, objId)[0];
				
				if(subjNode==null){
					subjNode = {id:subjId, label:subjId, weight:1, type:"node"};
					graph.nodes.push(subjNode);
				}
				
				if(objNode==null){
					objNode = {id:objId, label:objId, weight:1, type:"node"};
					graph.nodes.push(objNode);
				}
				
				var predNode = {id:predId, label:predId, weight:1, type:"pred"} ;
				graph.nodes.push(predNode);
				
				var blankLabel = "";
				
				graph.links.push({source:subjNode, target:predNode, predicate:blankLabel, weight:1});
				graph.links.push({source:predNode, target:objNode, predicate:blankLabel, weight:1});
				
				graph.triples.push({s:subjNode, p:predNode, o:objNode});
				
			});
			
			return graph;
		}
d3.demo = {};
var pannablecanvas=0;
/** CANVAS **/
d3.demo = {};
d3.demo.canvas = function() {

    "use strict";

    var width           = 600,
        height          = 800,
        zoomEnabled     = true,
        dragEnabled     = true,
        scale           = 1,
        translation     = [0,0],
        base            = null,
        wrapperBorder   = 2,
        minimap         = null,
        minimapPadding  = 20,
        minimapScale    = 0.15,
        circleSelection = null,
        force           = null;

    function canvas(selection) {

        base = selection;

        var xScale = d3.scale.linear()
            .domain([-width / 2, width / 2])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([-height / 2, height / 2])
            .range([height, 0]);

        var zoomHandler = function(newScale) {
            if (!zoomEnabled) { return; }
            if (d3.event) {
                scale = d3.event.scale;
            } else {
                scale = newScale;
            }
            if (dragEnabled) {
                var tbound = -height * scale,
                    bbound = height  * scale,
                    lbound = -width  * scale,
                    rbound = width   * scale;
                // limit translation to thresholds
                translation = d3.event ? d3.event.translate : [0, 0];
                translation = [
                    Math.max(Math.min(translation[0], rbound), lbound),
                    Math.max(Math.min(translation[1], bbound), tbound)
                ];
            }

            d3.select(".panCanvas, .panCanvas .bg")
                .attr("transform", "translate(" + translation + ")" + " scale(" + scale + ")");

            minimap.scale(scale).render();
        }; // startoff zoomed in a bit to show pan/zoom rectangle
            
        var zoom = d3.behavior.zoom()
            .x(xScale)
            .y(yScale)
            .scaleExtent([0.5, 5])
            .on("zoom.canvas", zoomHandler);

        var svg = selection.append("svg")
            .attr("class", "svg canvas")
            .attr("width",  width  + (wrapperBorder*2) + minimapPadding*2 + (width*minimapScale))
            .attr("height", height + (wrapperBorder*2) + minimapPadding*2)
            .attr("shape-rendering", "auto");

        var svgDefs = svg.append("defs");

        svgDefs.append("clipPath")
            .attr("id", "wrapperClipPathDemo02_gmult")
            .attr("class", "wrapper clipPath")
            .append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);
            
        svgDefs.append("clipPath")
            .attr("id", "minimapClipPathDemo02_gmult")
            .attr("class", "minimap clipPath")
            .attr("width", width)
            .attr("height", height)
            //.attr("transform", "translate(" + (width + minimapPadding) + "," + (minimapPadding/2) + ")")
            .append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);
            
        var filter = svgDefs.append("svg:filter")
            .attr("id", "minimapDropShadow_gmult")
            .attr("x", "-20%")
            .attr("y", "-20%")
            .attr("width", "150%")
            .attr("height", "150%");

        filter.append("svg:feOffset")
            .attr("result", "offOut")
            .attr("in", "SourceGraphic")
            .attr("dx", "1")
            .attr("dy", "1");

        filter.append("svg:feColorMatrix")
            .attr("result", "matrixOut")
            .attr("in", "offOut")
            .attr("type", "matrix")
            .attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.5 0");

        filter.append("svg:feGaussianBlur")
            .attr("result", "blurOut")
            .attr("in", "matrixOut")
            .attr("stdDeviation", "10");

        filter.append("svg:feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");
            
        var minimapRadialFill = svgDefs.append("radialGradient")
            .attr({
                id:"minimapGradient_gmult",
                gradientUnits:"userSpaceOnUse",
                cx:"500",
                cy:"500",
                r:"400",
                fx:"500",
                fy:"500"
            });
        minimapRadialFill.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#FFFFFF");
        minimapRadialFill.append("stop")
            .attr("offset", "40%")
            .attr("stop-color", "#EEEEEE");
        minimapRadialFill.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#E0E0E0");

        var outerWrapper = svg.append("g")
            .attr("class", "wrapper outer")
            .attr("transform", "translate(0, " + minimapPadding + ")");

        outerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", width + wrapperBorder*2)
            .attr("height", height + wrapperBorder*2);

        var innerWrapper = outerWrapper.append("g")
            .attr("class", "wrapper inner")
            .attr("clip-path", "url(#wrapperClipPathDemo02_gmult)")
            .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
            .call(zoom);

        innerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        var panCanvas = innerWrapper.append("g")
            .attr("class", "panCanvas")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(0,0)");
pannablecanvas=panCanvas;
        panCanvas.append("rect")
            .attr("class", "background")
            .attr("width", width+1000)
            .attr("height", height+1000);

        minimap = d3.demo.minimap()
            .zoom(zoom)
            .target(panCanvas)
            .minimapScale(minimapScale)
            .x(width + minimapPadding)
            .y(minimapPadding);

        svg.call(minimap);
            
        // startoff zoomed in a bit to show pan/zoom rectangle
        zoom.scale(0.5);
        zoomHandler(0.5);

        /** ADD SHAPE **/
        canvas.addItem = function(item) {
            panCanvas.node().appendChild(item.node());
            minimap.render();
        };
        /*
        canvas.addCircles = function(circleDataArray) {
            circleSelection = panCanvas.selectAll(".
            
            
            circle").data(circleDataArray).enter()
                .append("circle")
                .attr("class", "forcecircle")
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                })
                .attr("r", 8);
            force = d3.layout.force()
                .nodes(circleDataArray)
                .size([width, height])
                .on("tick", function(){
                    circleSelection
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                    minimap.render();
                })
                .start();
        }
**/ 
canvas.drawgraph = function(graphr) {
  // ==================== Add Marker ====================
  panCanvas.append("svg:defs").selectAll("marker")
      .data(["end"])
    .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", -0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("svg:polyline")
      .attr("points", "0,-5 10,0 0,5")
      ;
    
  // ==================== Add Links ====================
   var links = panCanvas.selectAll(".link")
            .data(graph.triples)
            .enter()
            .append("path")
              .attr("marker-end", "url(#end)")
              .attr("class", "link")
							.attr("fill", "none")
							.attr("stroke", "#999")
							.attr("stroke-opacity", 0.6)
          ;
              
  // ==================== Add Link Names =====================
  var linkTexts = panCanvas.selectAll(".link-text")
                .data(graph.triples)
                .enter()
                .append("text")
          .attr("class", "link-text")
          .text( function (d) { return d.p.label; })
        ;

    //linkTexts.append("title")
    //		.text(function(d) { return d.predicate; });
        
  // ==================== Add Link Names =====================
  var nodeTexts = panCanvas.selectAll(".node-text")
                .data(filterNodesByType(graph.nodes, "node"))
                .enter()
               
                .append("text")
          .attr("class", "node-text")
          .text( function (d) { return d.label; })
        ;

    //nodeTexts.append("title")
    //		.text(function(d) { return d.label; });

  // ==================== Add Node =====================
  var nodes = panCanvas.selectAll(".node")
                         
            .data(filterNodesByType(graph.nodes, "node"))
            .enter()
                            
                                      
            .append("circle")
              .attr("class", "node")
              .attr("fill", "black")     
                          
              .attr("r",8)
          ;//nodes


    force = d3.layout.force()
    
//var force = d3.layout.force().size([800, 600]);
        .nodes(graphr.nodes)
        .links(graphr.links)
        .size([width, height])

        .on("tick", function() {
  				nodes
  					.attr("cx", function(d){ return d.x; })
  					.attr("cy", function(d){ return d.y; })
  					;
  				
  				links
  					.attr("d", function(d) {
  						  return "M" 	+ d.s.x + "," + d.s.y
  										+ "S" + d.p.x + "," + d.p.y
  										+ " " + d.o.x + "," + d.o.y;
  						})
  					;
  								   
  				nodeTexts
  					.attr("x", function(d) { return d.x + 12 ; })
  					.attr("y", function(d) { return d.y + 3; })
  					;
  					

  				linkTexts
  					.attr("x", function(d) { return 4 + (d.s.x + d.p.x + d.o.x)/3  ; })
  					.attr("y", function(d) { return 4 + (d.s.y + d.p.y + d.o.y)/3 ; })
                        minimap.render();
        })
      
       .charge(-1000)
        .linkDistance(85)
        .start()
}





        /** RENDER **/
        canvas.render = function() {
            svgDefs
                .select(".clipPath .background")
                .attr("width", width)
                .attr("height", height);

            svg
                .attr("width",  width  + (wrapperBorder*2) + minimapPadding*2 + (width*minimapScale))
                .attr("height", height + (wrapperBorder*2));

            outerWrapper
                .select(".background")
                .attr("width", width + wrapperBorder*2)
                .attr("height", height + wrapperBorder*2);

            innerWrapper
                .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
                .select(".background")
                .attr("width", width)
                .attr("height", height);

            panCanvas
                .attr("width", width)
                .attr("height", height)
                .select(".background")
                .attr("width", width)
                .attr("height", height);

            minimap
                .x(width + minimapPadding)
                .y(minimapPadding)
                .render();
        };

        canvas.zoomEnabled = function(isEnabled) {
            if (!arguments.length) { return zoomEnabled }
            zoomEnabled = isEnabled;
        };

        canvas.dragEnabled = function(isEnabled) {
            if (!arguments.length) { return dragEnabled }
            dragEnabled = isEnabled;
        };

        canvas.reset = function() {
            d3.transition().duration(750).tween("zoom", function() {
                var ix = d3.interpolate(xScale.domain(), [-width  / 2, width  / 2]),
                    iy = d3.interpolate(yScale.domain(), [-height / 2, height / 2]),
                    iz = d3.interpolate(scale, 1);
                return function(t) {
                    zoom.scale(iz(t)).x(xScale.domain(ix(t))).y(yScale.domain(iy(t)));
                    zoomHandler(iz(t));
                };
            });
        };
    }


    //============================================================
    // Accessors
    //============================================================


    canvas.width = function(value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    };

    canvas.height = function(value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    };

    canvas.scale = function(value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return this;
    };

    return canvas;
};



/** MINIMAP **/
d3.demo.minimap = function() {

    "use strict";

    var minimapScale    = 0.05,
        scale           = 1,
        zoom            = null,
        base            = null,
        target          = null,
        width           = 10,
        height          = 0,
        x               = 0,
        y               = 0,
        frameX          = 0,
        frameY          = 0;

    function minimap(selection) {

        base = selection;

        var container = selection.append("g")
            .attr("class", "minimap")
            .call(zoom);

        zoom.on("zoom.minimap", function() {
            scale = d3.event.scale;
        });


        minimap.node = container.node();

        var frame = container.append("g")
            .attr("class", "frame")

        frame.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("filter", "url(#minimapDropShadow_gmult)");

        var drag = d3.behavior.drag()
            .on("dragstart.minimap", function() {
                var frameTranslate = d3.demo.util.getXYFromTranslate(frame.attr("transform"));
                frameX = frameTranslate[0];
                frameY = frameTranslate[1];
            })
            .on("drag.minimap", function() {
                d3.event.sourceEvent.stopImmediatePropagation();
                frameX += d3.event.dx;
                frameY += d3.event.dy;
                frame.attr("transform", "translate(" + frameX + "," + frameY + ")");
                var translate =  [(-frameX*scale),(-frameY*scale)];
                target.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                zoom.translate(translate);
            });

        frame.call(drag);

        /** RENDER **/
        minimap.render = function() {
            scale = zoom.scale();
            container.attr("transform", "translate(" + x + "," + y + ")scale(" + minimapScale + ")");
            var node = target.node().cloneNode(true);
            node.removeAttribute("id");
            base.selectAll(".minimap .panCanvas").remove();
            minimap.node.appendChild(node);
            var targetTransform = d3.demo.util.getXYFromTranslate(target.attr("transform"));
            frame.attr("transform", "translate(" + (-targetTransform[0]/scale) + "," + (-targetTransform[1]/scale) + ")")
                .select(".background")
                .attr("width", width/scale)
                .attr("height", height/scale);
            frame.node().parentNode.appendChild(frame.node());
            d3.select(node).attr("transform", "translate(1,1)");
        };
    }


    //============================================================
    // Accessors
    //============================================================


    minimap.width = function(value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    };


    minimap.height = function(value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    };


    minimap.x = function(value) {
        if (!arguments.length) return x;
        x = parseInt(value, 10);
        return this;
    };


    minimap.y = function(value) {
        if (!arguments.length) return y;
        y = parseInt(value, 10);
        return this;
    };


    minimap.scale = function(value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return this;
    };


    minimap.minimapScale = function(value) {
        if (!arguments.length) { return minimapScale; }
        minimapScale = value;
        return this;
    };


    minimap.zoom = function(value) {
        if (!arguments.length) return zoom;
        zoom = value;
        return this;
    };


    minimap.target = function(value) {
        if (!arguments.length) { return target; }
        target = value;
        width  = parseInt(target.attr("width"),  10);
        height = parseInt(target.attr("height"), 10);
        return this;
    };

    return minimap;
};




/** UTILS **/
d3.demo.util = {};
d3.demo.util.getXYFromTranslate = function(translateString) {
    var currentTransform = d3.transform(translateString);
    currentX = currentTransform.translate[0];
    currentY = currentTransform.translate[1];
    return [currentX, currentY];
};


var canvasWidth = 20000;
var shapes = [];
var lastXY = 1;
var zoomEnabled = true;
var dragEnabled = true;

var canvas = d3.demo.canvas().width(800
                                   ).height(600);








function DrawGraph(graph){
     d3.select("#canvas_gmult").call(canvas)
     canvas.drawgraph(graph); 
     nodetexts = d3.select(".panCanvas").selectAll(".node-text");
     nodes = d3.select(".panCanvas").selectAll(".node")
     search();
     return   
    }

 
function drawgraphcolored(t1,t2,ta,td){              // give triples1 , triples 2 , triple added and triple deleted and draws the graph on the canvas
   

    triples_merged = triplesMerge(t1, ta);
    graph = triplesToGraph(triples_merged);
 d3.select("#canvas_gmult").call(canvas)
 canvas.drawgraph(graph); 
 nodetexts = d3.select(".panCanvas").selectAll(".node-text");
 nodes = d3.select(".panCanvas").selectAll(".node")
 if (t2!=0){tt2 = generateNewTriples(t1,ta,td);
    colorDeletedLinks(t1, td);  //color the deleted links, Input: old triples, deleted triples
	colorDeletedNodes(tt2, td);  //color the deleted nodes, Input: new triples, deleted triples
	colorAddedLinks(t1, ta);      //color the added links, Input: old triples, added triples
	colorAddedNodes(t1, triples_merged);   }     //color the added nodes, Input: old triples, added triples
    console.log(tt2)

    search(); 
    $( ".panCanvas" ).append( "<p>Test</p>" );
 return
 }



drawgraphcolored(triples_1,triples_2,triples_added,triples_deleted);


