
var w = 800,
    h = 600;
var zoomFactor = 4;

zoom = d3.behavior.zoom();

 triples = [
  			{subject:"ex:ThaiLand", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"},
			{subject:"ex:TomYumKung", 	predicate:"ex:isFoodOf", 	object:"ex:ThaiLand"},
  			{subject:"ex:TomYumKung", 	predicate:"rdf:type", 		object:"ex:SpicyFood"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:shrimp"},
            {subject:"ex:ThaiLand", 	predicate:"ex:includes", 	object:"ex:shrimp"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:requires", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:hasSpicy", 	object:"ex:chilly"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:lemon"},
    {subject:"ex:TomYusmKung", 	predicate:"ex:includes", 	object:"ex:lemon"},
     {subject:"ex:TomYusmKung", 	predicate:"ex:includes", 	object:"ex:lemon"}, {subject:"ex:TomYusmKung", 	predicate:"ex:inscludes", 	object:"ex:lemosn"},
  			{subject:"ex:ThaiLand", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"},
			{subject:"ex:TomYumKung", 	predicate:"ex:isFoodOf", 	object:"ex:ThaiLand"},
  			{subject:"ex:TodfdfmYumKung", 	predicate:"rdf:type", 		object:"ex:SpicyFood"},
  			{subject:"ex:TomYumKung", 	predicate:"exdfdf:includes", 	object:"ex:shrimp"},
            {subject:"ex:ThaiLand", 	predicate:"ex:includes", 	object:"ex:shrimp"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:requires", 	object:"ex:cfdfhilly"},
		
  		];



 triples_1 = [
  			{subject:"ex:ThaiLand", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"},
			{subject:"ex:TomYumKung", 	predicate:"ex:isFoodOf", 	object:"ex:ThaiLand"},
  			{subject:"ex:TomYumKung", 	predicate:"rdf:type", 		object:"ex:SpicyFood"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:shrimp"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:requires", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:hasSpicy", 	object:"ex:chilly"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:lemon"},
  			{subject:"ex:lemon", 		predicate:"ex:hasTaste", 	object:"ex:sour"},
  			{subject:"ex:chilly", 		predicate:"ex:hasTaste", 	object:"ex:spicy"}
  		];
		
 triples_22 =[
  			{subject:"ex:ThaiLand", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"},
			{subject:"ex:TomYumKung", 	predicate:"ex:isFoodOf", 	object:"ex:ThaiLand"},
  			{subject:"ex:TomYumKung", 	predicate:"rdf:type", 		object:"ex:SpicyFood"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:shrimp"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:requires", 	object:"ex:chilly"},
			{subject:"ex:TomYumKung", 	predicate:"ex:hasSpicy", 	object:"ex:chilly"},
  			{subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:lemon"},
  			{subject:"ex:Taiwan", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"}		
		];

		
 triples_added = [
  			{subject:"ex:Taiwan", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"}		
  		];
		
 triples_deleted = [
  			{subject:"ex:lemon", 		predicate:"ex:hasTaste", 	object:"ex:sour"},
  			{subject:"ex:chilly", 		predicate:"ex:hasTaste", 	object:"ex:spicy"}  		
		];
svg = d3.select("#canvas_gmult");

	triples_2 = generateNewTriples(triples_1, triples_added, triples_deleted);

function updategraphs(){
 triples_merged = triplesMerge(triples_1, triples_added);
 graph = triplesToGraph(triples_merged);
}

function generategraph(t1,t2,ta,td){
    
       return triplesToGraph( triplesMerge(t1, ta));     

}
