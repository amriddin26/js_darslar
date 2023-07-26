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
		
function triplesMerge(triples_old, triples_added)
{
	var triples_merged = triples_old.slice(0);
	
	var length = triples_added.length;
	var cnt = 0;
	
	while(cnt < length)
	{
		triples_merged.push(triples_added[cnt]);
		cnt++;
	}
	return triples_merged;
}

function colorDeletedLinks(triples_old, triples_deleted)
{
	
	/*Deleted Links*/
	var cnt_old = 0;
	var cnt_deleted = 0;
	var length = triples_old.length;
	
	while(cnt_old < length)
	{
		if(triples_old[cnt_old].subject == triples_deleted[cnt_deleted].subject)
		{
			if(triples_old[cnt_old].predicate == triples_deleted[cnt_deleted].predicate)
			{	
				if(triples_old[cnt_old].object == triples_deleted[cnt_deleted].object)
				{
					document.getElementsByClassName("link")[cnt_old].setAttribute("stroke-dasharray", 5.5);
					document.getElementsByClassName("link")[cnt_old].setAttribute("stroke-width", 2);					
					document.getElementsByClassName("link")[cnt_old].setAttribute("stroke", "red");
					var original_text = document.getElementsByClassName("link-text")[cnt_old].innerHTML;
					var new_text = "[deleted]" + original_text;
					document.getElementsByClassName("link-text")[cnt_old].innerHTML = new_text;					
					cnt_deleted++;
				}
			}
		}
		cnt_old++;
	}
}

function colorDeletedNodes(triples_new, triples_deleted)
{
	var nodes_number = document.getElementsByClassName("node-text").length;
	
	var cnt_new = 0;
	var cnt_deleted = 0;
	
	while(cnt_deleted < triples_deleted.length)
	{
		while(cnt_new < triples_new.length)
		{
			if(triples_deleted[cnt_deleted].object != triples_new[cnt_new].subject)
			{
				if(triples_deleted[cnt_deleted].object != triples_new[cnt_new].object)
				{
					cnt_new++;
				}else{
					break;
				}
			}else{
				break;
			}
		}
		
		if(cnt_new == triples_new.length)
		{
			var cnt_nodes = 0;
			while(cnt_nodes < nodes_number)
			{
				if(document.getElementsByClassName("node-text")[cnt_nodes].innerHTML == triples_deleted[cnt_deleted].object)
				{
					document.getElementsByClassName("node")[cnt_nodes].setAttribute("fill", "red");
					var original_text = document.getElementsByClassName("node-text")[cnt_nodes].innerHTML;
					var new_text = "[deleted]" + original_text;
					document.getElementsByClassName("node-text")[cnt_nodes].innerHTML = new_text;					
				}
				cnt_nodes++;
			}
		}
		
		cnt_new = 0;
		
		cnt_deleted++;
	}
}

function colorAddedLinks(triples_old, triples_added)
{
	var cnt_added = 0;
	
	while(cnt_added < triples_added.length)
	{
		document.getElementsByClassName("link")[triples_old.length+cnt_added].setAttribute("stroke", "green");
		document.getElementsByClassName("link")[triples_old.length+cnt_added].setAttribute("stroke-width", 2);		
		var original_text = document.getElementsByClassName("link-text")[triples_old.length+cnt_added].innerHTML;
		var new_text = "[added]" + original_text;
		document.getElementsByClassName("link-text")[triples_old.length+cnt_added].innerHTML = new_text;		
		cnt_added++;
	}
}

function colorAddedNodes(triples_old, triples_merged)
{	
	var nodes_old = countNodes(triples_old);
	var nodes_merged = countNodes(triples_merged);
	
	var cnt = 0;
	var number_added_nodes = nodes_merged - nodes_old;
	
	while(cnt < number_added_nodes)
	{
		document.getElementsByClassName("node")[nodes_old+cnt].setAttribute("fill", "green");
		var original_text = document.getElementsByClassName("node-text")[nodes_old+cnt].innerHTML;
		var new_text = "[added]" + original_text;
		document.getElementsByClassName("node-text")[nodes_old+cnt].innerHTML = new_text;
		cnt++;
	}
}

//function for counting the number of nodes from a triples set
function countNodes(triples)
{
	var nodes = [];
	
	var cnt_triples = 0;
	var cnt_nodes = 0;
	
	nodes.push(triples[0].subject);
	
	while(cnt_triples < triples.length)
	{
		while(cnt_nodes < nodes.length)
		{
			if(triples[cnt_triples].subject == nodes[cnt_nodes]){break;}
			cnt_nodes++;
		}
		
		if(cnt_nodes == nodes.length){nodes.push(triples[cnt_triples].subject);}
		cnt_nodes = 0;
		
		while(cnt_nodes < nodes.length)
		{
			if(triples[cnt_triples].object == nodes[cnt_nodes]){break;}
			cnt_nodes++;
		}
		
		if(cnt_nodes == nodes.length){nodes.push(triples[cnt_triples].object);}
		cnt_nodes = 0;
		
		cnt_triples++;
	}
	
	return nodes.length;
}

function generateNewTriples(triples_old, triples_added, triples_deleted)
{
	var cnt_new = 0;
	var cnt_deleted = 0;
	var cnt_added = 0;
	var triples_new = triples_old.slice(0);
	
	while(cnt_added < triples_added.length)
	{
		triples_new.push(triples_added[cnt_added]);
		cnt_added++;
	}
	
	
	while(cnt_deleted < triples_deleted.length)
	{
		while(cnt_new < triples_new.length)
		{
			if(triples_deleted[cnt_deleted].subject == triples_new[cnt_new].subject)
			{
				if(triples_deleted[cnt_deleted].predicate == triples_new[cnt_new].predicate)
				{
					if(triples_deleted[cnt_deleted].object == triples_new[cnt_new].object)
					{
						triples_new.splice(cnt_new, 1);
					}
				}
			}
			cnt_new++;
		}
		cnt_new = 0;
		
		cnt_deleted++;
	}
	
	return triples_new;
}