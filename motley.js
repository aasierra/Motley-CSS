/*!
* Motley CSS (https://github.com/aasierra/Motley-CSS)
* Copyright (c) 2014 Anthony A Sierra
* Licensed under MIT (https://github.com/aasierra/Motley-CSS/LICENSE)
*/
/*
The motley global object takes in the following options
{
	fileName:'',
	limit:4000,
	diagnostics:false,
	callback:Function
}
*/

var other = require('line-by-line');
module.exports = function (options) {
	if (!options.fileName) {
		console.log("'fileName' NOT FOUND NEED FILENAME FOR FILE TO PARSE");
	}
	//Get the line by line library
	var lbl = require('line-by-line');

	//Get the file to start parsing line by line.
	var lr = new lbl(options.fileName);

	//A flag during parse to know when we are in the middle of parsing a comment
	var inComment = false;

	//A count of the amount of comments in the file.
	var commentCount = 0;

	//The files that will be created at the end.
	var files = [];

	//The file output string for each file that will be altered throughout the algorithm.
	var fileOutput = "";

	//An selector count to keep track of while iterating the file.
	var selectorCount = 0;

	//A total selector count for diagnostics at the end.
	var totalSelectorCount = 0;

	//The IE8 limit that is imposed on CSS files.
	var selectorLimit = (options.limit) ? options.limit : 4095;

	//A flag to be used while parsing to know whether we are about to create a new file or not.
	var nextClear = false;

	//An amount that lets us know how many nests we are entering so we can leave them before cutting the file off.
	var contextCount = 0;

	if (options.diagnostics) {
		console.log("Starting");
	}

	lr.on("error", function (error) {
		console.log("Operation could not be completed : " + error);
	});

	lr.on("line", function (line) {
		if (line.indexOf("/*") >= 0) {
			inComment = true;
			commentCount++;	
		}
		if (!inComment) {
			if(line.indexOf("{") >= 0) {
				contextCount++;
				selectorCount++;
				if (selectorCount >= selectorLimit) {
					nextClear = true;
				}
			}
			fileOutput += "\n" + line;
			if (line.indexOf("}") >= 0) {
				contextCount--;
				if (nextClear && contextCount == 0) {
					files.push(fileOutput);
					fileOutput = "";
					totalSelectorCount += selectorCount;
					selectorCount = 0;
					nextClear = false;
				}
			}
		}
		if (line.indexOf("*/") >= 0) {
			inComment = false;
		}
	});

	lr.on("end", function () {
		var fs = require("fs");
		files.push(fileOutput);
		for (var i = 0; i < files.length; i++) {
			var fileName = options.fileName;
			if (i > 0) {
				fileName = fileName.substring(0, fileName.indexOf(".css")) + i + ".css";
			}
			var importName = "";
			if (i + 1 < files.length) {
				if (fileName.match("/").length) {
					var parts = fileName.split("/");
					if (parts.length) {
						var toSubString = parts[parts.length-1];
						importName = toSubString.substring(0, toSubString.indexOf(".css")) + (i + 1) + ".css";
					}
				} else {
					importName = fileName.substring(0, options.fileName.indexOf(".css")) + (i + 1) + ".css";
				}
			}
			var importText = "";
			if (importName) {
				importText = "@import url('" + importName + "');\n";
			}
			var outputPrint = function (error) {
				if (error) {
					console.log(error);
				} else {
					console.log("File was created.");
				}
			};
			fs.writeFile(fileName, importText + files[i], outputPrint);
		}
		if (options.diagnostics) {
			console.log("Comments : " + commentCount);
			console.log("Selectors : " + selectorCount);
		}
		if(options.callback) {
			options.callback();
		}
	});
}