(function(){
	var express = require('express');
	var app = express();
	var request = require('request');
	// var redis = require("redis"),
 //       	client = redis.createClient();
 	var args = process.argv;

	var config = {
		defaults: {
			port: 3000
		},
		"providers": ['http://www.celestrak.com/NORAD/elements/resource.txt']
	};

	var tles = {};

	var port = args[2] || config.defaults.port;

	app.get('/', function(req, res){
		console.log('request headers: ', req.headers);
		var output;
		var satID = req.query.sat || req.query.id;
		var callback = req.query.callback || req.query.cb;

		var output = JSON.stringify(tles, null, 4);

		res.setHeader("Access-Control-Allow-Origin", "*");

		if(typeof satID != 'undefined') {
			output = {
				tle: tles[satID]
			};
		} else {
			output = {
				error: "Satellite ID not found."
			};
		}

		if(callback) {
			res.send(callback + '(' + JSON.stringify(output) + ');');
		} else {
			res.send(JSON.stringify(output));
		}
	});

	function getTLE(url, callback) {
		request(url, function (error, response, body) {
		  if (!error && response.statusCode == 200 && typeof callback == 'function') {
		    callback(body);
		  }
		});
	}

	function updateTLEs(response) {
		var arr = response.split('\r\n');

		var curTLE, curSatID;
		arr.forEach(function(line){
			if(/^[A-Za-z]$/.test(line[0])) {
				// satellite name
				curTLE = line + '\n';
			} else if(line[0] == '1') {
				// line 1
				curTLE += line + '\n';
				curSatID = line.substr(2,5);
			} else if(line[0] == '2') {
				// line 2
				curTLE += line;
				tles[curSatID] = curTLE;
				curTLE = '';
			}
		});

		console.log(tles)
	}

	function init() {
		var server = app.listen(port, function() {
		    console.log('Listening on port %d', server.address().port);
		});

		getTLE(config.providers[0], updateTLEs);

	    // client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
	    // client.hkeys("hash key", function (err, replies) {
	    //     console.log(replies.length + " replies:");
	    //     replies.forEach(function (reply, i) {
	    //         console.log("    " + i + ": " + reply);
	    //     });
	    //     client.quit();
	    // });
	}

	init();

})()