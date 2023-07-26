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
		
		/*
		function update(){
			// ==================== Add Marker ====================
			svg.append("svg:defs").selectAll("marker")
			    .data(["end"])
			  .enter().append("svg:marker")
			    .attr("id", String)
			    .attr("viewBox", "0 -5 10 10")
			    .attr("refX", 22)
			    .attr("refY", -0.5)
			    .attr("markerWidth", 6)
			    .attr("markerHeight", 6)
			    .attr("orient", "auto")
			  .append("svg:polyline")
			    .attr("points", "0,-5 10,0 0,5")
			    ;
				
			// ==================== Add Links ====================
			 var links = svg.selectAll(".link")
								.data(graph.triples)
								.enter()
								.append("path")
									.attr("marker-end", "url(#end)")
									.attr("class", "link")
							;
									
			// ==================== Add Link Names =====================
			var linkTexts = svg.selectAll(".link-text")
		                .data(graph.triples)
		                .enter()
		                .append("text")
							.attr("class", "link-text")
							.text( function (d) { return d.p.label; })
						;

				//linkTexts.append("title")
				//		.text(function(d) { return d.predicate; });
						
			// ==================== Add Link Names =====================
			var nodeTexts = svg.selectAll(".node-text")
		                .data(filterNodesByType(graph.nodes, "node"))
		                .enter()
                   
		                .append("text")
							.attr("class", "node-text")
							.text( function (d) { return d.label; })
						;

				//nodeTexts.append("title")
				//		.text(function(d) { return d.label; });
			
			// ==================== Add Node =====================
			var nodes = svg.selectAll(".node")
                             
								.data(filterNodesByType(graph.nodes, "node"))
								.enter()
                                
                                          
								.append("circle")
									.attr("class", "node")
                               
			   	                    
									.attr("r",8)
									.call(force.drag)
							;//nodes
                            
		
			// ==================== Force ====================
			force.on("tick", function() {
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
					;
			});
			
			// ==================== Run ====================
			force
		      .nodes(graph.nodes)
		      .links(graph.links)
			  .charge(-1000)
			  .linkDistance(85)
		      .start()
			  ;
		}*/
		