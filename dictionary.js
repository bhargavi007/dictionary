/*
api key  : "fd3e8c9208f8cf3b776b2baa4a0da788"
app id   : "7f1e83f1"
base url : "https://od-api.oxforddictionaries.com/api/v1"

oxford dictionary API end points

GET /entiries/{source_language}/{word_id}          -- defination
GET /entiries/{source_language}/{word_id}/synonyms -- synonyms
GET /entiries/{source_language}/{word_id}/antonyms -- antonyms
GET /entries/{source_language}/{word_id}/sentences -- example

*/

var inquirer = require('inquirer');
var request = require('request');

var app_id = "7f1e83f1";
var app_key = "fd3e8c9208f8cf3b776b2baa4a0da788";
var randomWords = ["protect","eat","drink","soft","ability","absolute","present","plant","minute","place","order","eye","dashing","voiceless","embarrass","question","ubiquitous","calendar"];

var questions = [{
  type: 'input',
  name: 'command',
  message: "Enter the Command",
}]


var commands = {
	"./dict def" :"defination",
	"./dict syn":"synonym",
	"./dict ant":"antonym",
	"./dict ex":"example",
	"./dict":"details",
	"./dict dict":"details",
	"./dict play":"game"
};

function ask() {
  inquirer.prompt(questions).then(answers => {
    var input = `${answers['command']}`;
	if(input == "./dict play"){
		game();
	}
	else if(input == "./dict"){
		wordOfTheDay();
	}
	else{
		var word = input.split(" ").pop();

		var lastIndex = input.lastIndexOf(" ");
		var functionString = input.substring(0, lastIndex);
		console.log(word,functionString);

		if(commands[functionString]){
			var wordFunction = commands[functionString];
			if(wordFunction == "defination"){
				defination(word).then(function(resp){
					console.log(resp.join('\n'));
					ask();
				});
			}
			else if(wordFunction == "synonym"){
				synonym(word).then(function(resp){
					console.log(resp.join('\n'));
					ask();
				});
			}
			else if(wordFunction == "antonym"){
				antonym(word).then(function(resp){
					console.log(resp.join('\n'));
					ask();
				});
			}
			else if(wordFunction == "example"){
				example(word).then(function(resp){
					console.log(resp.join('\n'));
					ask();
				});
			}
			else if(wordFunction == "details"){
				details(word);
			}
			else if(wordFunction == "wordOfTheDay"){
				
			}
		}
		else{
			console.log("Invalid Command");
		}
	}
  });
}

ask();


function defination(word){
	console.log("**** Defination of word ******");
	return new Promise( function (resolve, reject){
		var url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/'+word;
	 	request({
		  	headers: {
		      	'app_id': app_id,
		      	'app_key': app_key
		    },
		    uri: url,
		    method: 'GET'
		}, function (err, res, body) {
			var definitions = [];
			if(res.statusCode == 404){
				console.log("Could not find the defination of the word");
				resolve(definitions)
			}
		    else if(body && JSON.parse(body)){
		    	var body = JSON.parse(body);
		    	var results = body.results;
			    if(body.results[0]){
			    	var lexicalEntries = body.results[0]["lexicalEntries"];
			    	if(lexicalEntries.length > 0){
			    		var wordData = lexicalEntries[0];
			    		var entries = lexicalEntries[0]["entries"];
			    		var worddefinations = entries[0]["senses"];
			    		worddefinations.forEach(function(def){
			    			if(definitions.length < 5){
			    				definitions.push(def["definitions"]);
			    			}
			    		});
			    		resolve(definitions)
			    	}
			    }
		    }
		    else{
		    	console.log("Could not find the defination of the word");
		    }
		});
 	});
}

function synonym(word){
	console.log("**** Synonyms of word ******");
	return new Promise( function (resolve, reject){
		var url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/'+word+'/synonyms';
	 	request({
		  	headers: {
		      	'app_id': app_id,
		      	'app_key': app_key
		    },
		    uri: url,
		    method: 'GET'
		}, function (err, res, body) {
			var resultArr = [];
			if(res.statusCode == 404){
				console.log("Could not find the synonyms of the word");
				resolve(resultArr);
			}
		    else if(body && JSON.parse(body)){
		    	var body = JSON.parse(body);
		    	var results = body.results;
			    if(body.results[0]){
			    	var lexicalEntries = body.results[0]["lexicalEntries"];
			    	if(lexicalEntries.length > 0){
			    		var wordData = lexicalEntries[0];
			    		var entries = lexicalEntries[0]["entries"];
			    		var synonyms = entries[0]["senses"][0]["synonyms"]
			    		synonyms.forEach(function(synonym){
			    			if(resultArr.length < 5){
			    				resultArr.push(synonym["text"]);
			    			}
			    		});
			    		resolve(resultArr);
			    	}
			    }
		    }
		    else{
		    	console.log("Could not find the synonyms of the word");
		    }
		});
 	});
	
}

function antonym(word){
	console.log("**** Antonyms of word ******");
	return new Promise( function (resolve, reject){
		var url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/'+word+'/antonyms';
	 	request({
		  	headers: {
		      	'app_id': app_id,
		      	'app_key': app_key
		    },
		    uri: url,
		    method: 'GET'
		}, function (err, res, body) {
			var resultArr = [];
			if(res.statusCode == 404){
				console.log("Could not find the antonyms of the word");
				resolve(resultArr);
			}
		    else if(body && JSON.parse(body)){
		    	var body = JSON.parse(body);
		    	var results = body.results;
			    if(body.results[0]){
			    	var lexicalEntries = body.results[0]["lexicalEntries"];
			    	if(lexicalEntries.length > 0){
			    		var wordData = lexicalEntries[0];
			    		var entries = lexicalEntries[0]["entries"];
			    		var antonyms = entries[0]["senses"][0]["antonyms"]
			    		antonyms.forEach(function(antonym){
			    			if(resultArr.length < 5){
			    				resultArr.push(antonym["text"]);
			    			}
			    		});
			    		resolve(resultArr);
			    	}
			    }
		    }
		    else{
		    	console.log("Could not find the antonyms of the word");
		    }
		});
 	});
}

function example(word){
	console.log("**** Examples of word ******");
	return new Promise( function (resolve, reject){
		var url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/'+word+'/sentences';
	 	request({
		  	headers: {
		      	'app_id': app_id,
		      	'app_key': app_key
		    },
		    uri: url,
		    method: 'GET'
		}, function (err, res, body) {
			var resultArr = [];
			if(res.statusCode == 404){
				console.log("Could not find the examples of the word");
				resolve(resultArr);
			}
		    else if(body && JSON.parse(body)){
		    	var body = JSON.parse(body);
		    	var results = body.results;
			    if(body.results[0]){
			    	var lexicalEntries = body.results[0]["lexicalEntries"];
			    	if(lexicalEntries.length > 0){
			    		var wordData = lexicalEntries[0];
			    		var sentences = lexicalEntries[0]["sentences"];
			    		sentences.forEach(function(sentence){
			    			if(resultArr.length < 5){
			    				resultArr.push(sentence.text);
			    			}
			    		})
			    		resolve(resultArr);
			    	}
			    }
		    }
		    else{
		    	console.log("Could not find the examples of the word");
		    }
		});
 	});
}

function details(word){
	defination(word).then(function(resp){
		console.log(resp.join('\n'));

		synonym(word).then(function(resp){
			console.log(resp.join('\n'));

			antonym(word).then(function(resp){
				console.log(resp.join('\n'));

				example(word).then(function(resp){
					console.log(resp.join('\n'));
					ask();
				});
			});
		});
	});
}

function wordOfTheDay(){
	var randomNumber = Math.floor(Math.random()*randomWords.length);
	var word = randomWords[randomNumber];
	console.log("Word of the Day is ",word);
	details(word);
}