 /*var tooltip = d3.select("#svg-body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 1e-6);

var nodes = svg.selectAll(".node")


.on("mouseover", mouseover)
.on("mousemove", function(d){
     tooltip.html(d)
                .text("Info about " + d.name + ":" + d.info)
                .style("left", d3.select(this).attr("cx")/zoomFactor  + "px")     
                .style("top", d3.select(this).attr("cy")/zoomFactor +  + "px");
            }
     
 )
.on("mouseout", mouseout)
 function mouseover() {
                tooltip.transition()
                .duration(300)
                .style("opacity", 1);
            }

            function mousemove(d) {
               
                xtooltip=d3.mouse(svg.node())[0];
                ytooltip=d3.mouse(svg.node())[1];
                vars=tooltip.html(d)
                tooltip
                .text("Info about " + d.name + ":" + d.info)
                .style("left", d + "px")     
                .style("top", d + "px");
            }

            

            function mouseout() {
                tooltip.transition()
                .duration(300)
                .style("opacity", 1e-6);
            }*/