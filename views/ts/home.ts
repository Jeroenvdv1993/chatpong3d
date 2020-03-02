import { stat } from "fs";

let saveDiv = document.getElementById('save');
if(saveDiv !== null){
    saveDiv.onclick = function(){
        $.post("/save", "hello world", function(data){
            alert("Data: " + data);
        });
        console.log('SAVED');
    }
}