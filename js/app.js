console.log("["+new Date().toLocaleTimeString()+"] App Script Loaded Success");
Parse.initialize("7QTpBogc0rQIaGMX8H4LPV6FPKFNQVuC6fh2Oidb", "OloSDXCQ5TE4T5w8nIl8tjln5wAkrznA3qe9StdI");
Parse.serverURL = "https://parseapi.back4app.com/";
var Pet = Parse.Object.extend("category");
read();

async function read() {
    query = new Parse.Query(Pet);
    query.limit(10);
	query.find().then(function(pet){
        if(pet){
        	window.pet = pet;
        	for (var i = 0; i < pet.length; i++) {
        		console.log(pet[i].id);
        	}
        } else {
           console.log("Nothing found, please try again");
        }
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);       
    });
}