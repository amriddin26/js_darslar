 input = `--------------------------------------------------------------------------------
| s                        | p                       | o                        |
=================================================================================
| <http://test.com/Adam>   | <http://test.com/knows> | <http://test.com/Emma>   |
| <http://test.com/Adam>   | <http://test.com/knows> | <http://test.com/Freddy> |
| <http://test.com/Carlos> | <http://test.com/knows> | <http://test.com/Freddy> |
| <http://test.com/Freddy> | <http://test.com/knows> | <http://test.com/Emma>   |
--------------------------------------------------------------------------------- `



function parsetexttotriples(input){

var fields = input.split('|');
fields.splice(0,5)
fields.splice(-1,1)
for( i=1; i<fields.length; i++){
    if ((i%3)===0) {fields.splice(i,1)
}	
}

targetforamt=[];
/*
for (i = 0; i < fields.length; i=i+3) {
           targetforamt.push({
           subject:   fields[i-2]
           predicate: fields[i-1]
           object:fields[i]
        })
               i++;
}
*/
var keys = ['subject', 'predicate', 'object'];

arrayOfObjects = [];
    
    
for(var i=0; i<fields.length; i=i+3){
    var obj = {};
    for(var j=0; j<keys.length; j++){
         obj[keys[j]] = fields[i+j];  
 
    
    }
    arrayOfObjects.push(obj);
}
    
return arrayOfObjects }

