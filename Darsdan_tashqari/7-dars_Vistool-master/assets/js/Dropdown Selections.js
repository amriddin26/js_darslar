var selectedgraph='';
$( "#Graphselection" ).click(function() {
 

var select = document.getElementById("selec"); 
        select.innerHTML='';
    

if (Availablegraphsets.length>0){               // fills the select graph dropdown menu with available graphsets
for(var i = 0; i < Availablegraphsets.length; i++) {
    var opt = Availablegraphsets[i];
    var el = document.createElement("li");
    var child = document.createElement("a");
    child.append(opt)
    el.setAttribute("id",'dropdownelement');
    el.setAttribute("role", "presentation");
    el.appendChild(child)
    
    select.appendChild(el);

    
}}})
$("#selec").on('click','li',(function() {
     selectedgraph = $(this).text();  
     loadavailablerevisions(selectedgraph)
     selectedgraphtext.innerText = "Selected Graph :"+selectedgraph;
     eee.innerText="Visualise Graph :"+selectedgraph;

    //the selected graph name is saved in this variable
}))

var selectedgraph='';
$( "#commitselection" ).click(function() {
 

var select = document.getElementById("selecC"); 
        select.innerHTML='';

if (availablecommits.length>0){               // fills the select graph dropdown menu with available graphsets
for(var i = 0; i < availablecommits.length; i++) {
    var opt = availablecommits[i].subject;
    var el = document.createElement("li");
    var child = document.createElement("a");
    child.append(opt)
    el.setAttribute("id",'dropdownelement');
    el.setAttribute("role", "presentation");
    el.appendChild(child)
    
    select.appendChild(el);
 

    
}}})
$("#selecC").on('click','li',(function() {
     selectedComm = $(this).text(); 
     K=loadrelevantgraphs(selectedgraph,selectedComm,commits,revisionss);
     filltempVariables(K)
     selectedcomm.innerText = "Selected Commit :"+selectedgraph;
     eee.innerText="Visualise Commit changes :"+selectedgraph;


    //the selected graph name is saved in this variable
}))
document.querySelector('#load').addEventListener('click', function(e) {
            var form = this;
            e.preventDefault();
            cou=0;
            swal({
                title: "Loading Graphs.",
                text: "The browser may appear unresponsive for few seconds! \n Make sure the r43ples backend is running on localhost",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'okay!',
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {
                     if (cou === 0){ 
                    reloadgraphs();
                     cou++;}
                    
                    swal({
                        title: 'Done!',
                        text: 'Graphs were successfully loaded!',
                        type: 'success'
                    });
                    
                } 
        })});