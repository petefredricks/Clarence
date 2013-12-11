var pkg = require('../../package.json' );
var nconf = require( 'nconf' );
var _ = require( 'underscore' );
var grunt = require( 'grunt' );
var gruntFile = require( '../../Gruntfile' )
var gruntConfig = gruntFile( grunt ) || grunt.config.data;

// get the root url for all client files
var resourceRoot = _.template( nconf.get( 'app:resourceRoot' ) )({ name: pkg.name, version: pkg.version });

function getPaths( req, page ) {

	if ( !nconf.get( 'app:optimized' ) || req.query[ '__scriptdebug__'] !== undefined ) {
		return unoptimizedPaths( page );
	}
	else {
		return optimizedPaths( page );
	}
}

function unoptimizedPaths( page ) {

	// read the CSS paths from the Gruntfile, strip out the 'public/' prefix
	var cssPaths = _.map( gruntConfig.cssjoin.join.files[ 'public/<%= pkg.version %>/css/' + page + '.css' ],	function( path ) {
		return [ resourceRoot + path.substring( 6 ) ];
	});

	// parse the javascript paths to include, strip out the 'public/' prefix
	var jsPaths = [];

	gruntConfig.uglify.cms.files[ 'public/<%= pkg.version %>/js/' + page + '.js' ].forEach( function( path ) {
		jsPaths.push( resourceRoot + path.substring( 6 ) );
	});

	return {
		css: cssPaths,
		js: jsPaths
	}
}

function optimizedPaths( page ) {
	return {
		css: [ resourceRoot + '/css/' + page + '.css' ],
		js:  [ resourceRoot + '/js/' + page + '.js' ]
	}
}

module.exports = {
	getPaths: getPaths
};