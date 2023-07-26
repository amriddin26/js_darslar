function search(){ var svg = d3.select(".panCanvas")

var counter = 0;
var nodeindex=0;

var length = nodetexts[0].length; ;
var selectedname="none"; 
var Textnodes = [];
var xjump=0;
var yjump=0;

while(counter < length){
  Textnodes.push(nodetexts[0][counter++].innerHTML
);
}

$( function() {
       $( "#tags" ).autocomplete({
        source: Textnodes,
        select: function( event , ui ) {
            //alert( "You selected: " + ui.item.label );
          selectedname=ui.item.label;
          nodeindex=Textnodes.indexOf(selectedname);
            xjump=nodes[0][nodeindex].getAttribute("cx")
            yjump=nodes[0][nodeindex].getAttribute("cy")
            
            var transx = (-xjump*zoomFactor + w/2),
                transy = (-yjump*zoomFactor+ h/2);
            svg.transition().attr("transform", "translate(" + transx + "," + transy + ")scale(" + zoomFactor + ")");
            zoom.scale(zoomFactor);
            zoom.translate([transx, transy]);
        }
  
        })})

                 }