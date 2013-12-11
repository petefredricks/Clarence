"use strict";

var fs = require( 'fs' );
var nconf = require( 'nconf' );
var pkgcloud = require( 'pkgcloud' );
var client = pkgcloud.storage.createClient({
	provider: 'rackspace',
	username: nconf.get( 'rackspace:username' ),
	apiKey: nconf.get( 'rackspace:apiKey' ),
	region:	nconf.get( 'rackspace:region' )
});

module.exports = {
	createUpload: createUpload,
	deleteFile: deleteFile,
	listFiles: listFiles
};

function listFiles( callback ) {

	client.getFiles( nconf.get( 'rackspace:container' ), function(err, files) {

		var output = [];

		if ( err ) {
			callback( err );
			return;
		}

		files.forEach( function( file ) {
			if ( file.name.substr(0, 12) === 'assets/test/' ) {
				console.log( file )
				output.push({ name: file.name });
			}
		});

		callback( null, output );
	});
}

function createUpload( name, callback ) {

	return client.upload({
		container: nconf.get( 'rackspace:container' ),
		remote: 'assets/test/' + name
	}, callback );
}

function deleteFile( name, callback ) {
	client.removeFile( nconf.get( 'rackspace:container' ), name, callback );
}