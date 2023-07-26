function filltempVariables(K) {
    
    graphy1=getrdfgraphs(selectedgraph);
    graphy2=getrdfgraphs(K.rdf2link);    diffy=getrdfgraphs(K.added);
    addy=getrdfgraphs(K.deleted);
    
}


$(document).ready(function() {
    $("#showgrapht").click(function(){
    
     drawgraphcolored(graphy1,1,addy,diffy);
            search();    

    });
    
    $("#details").click(function(){
        
        
        
        swal({
                title: "Selection Information",
                text: 'Selected Graph :'+selectedgraph+'\n selected Commit:'+selectedComm+'\n Current Revision:'+rdf2link,
                type: "info",
                showCancelButton: false,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'okay!',
                closeOnConfirm: false,
            })})
    
     
    $("#showsecrev").click(function(){
      swal({
                title: "Draw Current Graph",
                text: 'Retrieved Revision is empty , check backend',
                type: "error",})
    //DrawGraph(graphy2);
    });
      $("#showdiff").click(function(){
      swal({
                title: "Draw Difference Graph",
                text: 'Retrieved Revision is empty , check backend',
                type: "error",})
    //DrawGraph(graphy2);
    }); 
});
