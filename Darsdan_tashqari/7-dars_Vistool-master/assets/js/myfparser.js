function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });}
    
function parserdf(name,rdf){
    
var commits=[];
 var       res=[];
var comm=[];
var revisionss=[];
var j=0;    
for (j = 0; j < rdf.length; j++) { 
if (rdf[j].subject.includes('commit')  ){ commits.push(rdf[j])}
if (rdf[j].subject.includes('revision')  ){ revisionss.push(rdf[j])}}
for (j = 0; j < revisionss.length; j++) { 
if (revisionss[j].predicate.includes('DerivedFrom')  ){ res.push(revisionss[j])}
for (j = 0; j < commits.length; j++){
if (commits[j].predicate.includes("http://www.w3.org/ns/prov#used")  ){ comm.push(commits[j])}}
    
}
  return{
      commits,res,comm,
      revisionss
  }
    }

function showAvailablerevisions(revisionss){
    var j=0;    
for (j = 0; j < revisionss.length; j++) { 
if (revisionss[j].predicate.includes('DerivedFrom')  ){ res.push(revisionss[j])}
return res;
}
} 
    
