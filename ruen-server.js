
// modules
var fs = require('fs');
var http = require('http');
var console = require('console');
var colors = require('colors');
var readline = require('readline');
var s = require('string');
var shuffle = require('shuffle-array')
var moment = require('moment');
// vars
var fileData,
	logMsg,
	rand,
	realAnswer;
var wordsArr = [],
	errorMsg = [],
	answers = [];
// IO interface
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/* ------------------ */

function returnJSON(arr) {
	var arrJSON = [];
	arrJSON = arr.map(el => 
		 '{ "engWord" : "' + el[0] + '", "rusWord" : "' + el[1] + '" }'); 
	return arrJSON.join(',');
}

/* ------------------- */



fileData = fs.readFileSync('dictionary.txt', 'utf-8');

var linesArr = s(fileData).trim().lines();

console.log('--------------\r\n');

for (var x=0; x<linesArr.length; x++) {
	wordsArr.push(linesArr[x].split(' - '));
	console.log(wordsArr[x]);

	if (wordsArr[x].length != 2) {
		errorMsg.push("Error: There is no ENG or RUS word in line "+ x + ": " + linesArr[x]);
		errorMsg.push(wordsArr[x]);
		errorMsg.push('-------------\r\n');
	}
}



if (errorMsg.length) {
	console.log('--------------\r\n');
	console.log(('FOUND ' + errorMsg.length + ' ERRORS:\r\n').red);
	console.log(errorMsg);
}
else
 console.log("OK!\r\n");
console.log('total lines: ' + wordsArr.length);

console.log('--------------\r\n');

/* обработка запроса HTTP */

var dataJSON = returnJSON(wordsArr);

function onRequest(request, response) {
	response.writeHead(200, {"Content-type":"application/json"});
	if (request.url == "/dictionary") {
		console.log('DATA -> Client\r\n');
		response.write(JSON.stringify(dataJSON));
	} else
	{
		response.write("no data");
	}
	response.end();
}

http.createServer(onRequest).listen(8080);
console.log('Server is listening on 8080 port');
