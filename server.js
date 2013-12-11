"use strict";

var app = require( './app' );
var cluster = require('cluster');
var http = require( 'http' );
var nconf = require( 'nconf' );
var numCPUs = nconf.get( 'server:setWorkers') || require('os').cpus().length;

if ( cluster.isMaster ) {

	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on( 'exit', function( worker, code, signal ) {
		console.log( 'worker %d died (%s)', worker.process.pid, signal || code );
		cluster.fork();
	});

	cluster.on( 'listening', function( worker ) {
		console.log( 'Worker ' + worker.process.pid + ' is listening at: http://' + nconf.get( 'server:host' ) + ':' + nconf.get( 'server:port' ) );
	});
}
else {
	http.createServer( app ).listen( nconf.get( 'server:port' ) );
}

