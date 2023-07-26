var Availablegraphsets = ["hello first element","second element"];
var availablerevisions = ["first revion"];
var el = document.createElement( 'html' );

var url='';


/*function loadavailablerevisions(selection) {
    availablerevisions = [];
    url="http://127.0.0.1:8080/r43ples/revisiongraph?graph="+selection
    result = httpGet(url);
    
    rdf = turtle.parse(result);
    
	
    graph = triplesToGraph(rdf);

    drawgraph(graph);
    nodetexts=svg.selectAll(".node-text")
    refrechsearch();
return result}
*/
///////////////////////////////////////////////////////////////////////////
var A;
var B;
function loadavailablerevisions(selection) {
    commits=[];
    revisionss=[];
    A=[];
    
    availablerevisions = [];
    url="http://127.0.0.1:8080/r43ples/revisiongraph?graph="+selection
    result = httpGet(url);  
    rdf = turtle.parse(result);
    A=parserdf(selection,rdf);
    availablecommits=A.comm;
    commits=A.commits;
    revisionss=A.revisionss
    revisionnames=A.res
    sortByKey(commits,'subject')
    sortByKey(revisionss,'subject')
    sortByKey(revisionnames,'subject')
    sortByKey(availablecommits,'subject')
 

;
    
  // rdf = turtle.parse(result);
return revision}
////////////////////////////////////////////////
function reloadgraphs() {
    Availablegraphsets = [];
    url="http://127.0.0.1:8080/r43ples/createSampleDataset?dataset=all"
    result = httpGet(url);   

    el.innerHTML = result;
    ul=el.querySelector('.row ul ');
    for (var itemi=0;itemi<ul.childNodes.length;itemi++) {
        var item = ul.childNodes[itemi];
        if (item.nodeName == "LI") {
           Availablegraphsets.push(item.innerHTML)}} // Iterate things in this LI in the case that you need it put your code here to get the a element and change the color and background
       return 0;    
    }

function httpGet(theUrl)
{
    var result='';

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );    
    result=xmlHttp.responseText;
    //alert('done')
    return result;
    
}
function getrdfgraphs(link){
    graph1 = [];
    query='SELECT * WHERE { GRAPH <'+link +'>{?s ?p ?o }}'  
    url="http://127.0.0.1:8080/r43ples/sparql?query="+query
  // url='http://127.0.0.1:8080/r43ples/?query=SELECT+*+%0D%0AWHERE+%7B+%0D%0A%09GRAPH+%3C'+link+'%3E+%7B%0D%0A%09%09%3Fs+%3Fp+%3Fo+%0D%0A%09%7D%0D%0A%7D%0D%0A%09%09%09%09%09&format=text%2Fhtml'
     result = httpGet(url);  
     console.log(result);
     graph1=parsetexttotriples(result)  
          return graph1  }