var fs = require( 'fs' );
var app = require( '../app' );
var _ = require( 'underscore' );
var formidable = require('formidable');
var assets = require( '../lib/assets' );
var rackspace = require( '../lib/rackspace' );
var auth = app.get( 'admin auth' );

/*** ERROR HANDLING ***/

// Handle 404
app.use( function( req, res ) {
	res.status( 400 );
	res.render( 'error/404.jade', {
		title: '404: Page Not Found',
		paths: assets.getPaths( req, 'error' )
	});
});

// Handle 500
app.use( function( error, req, res ) {
	res.status( 500 );
	res.render( 'error/500.jade', {
		title: '500: Internal Server Error',
		error: error,
		paths: assets.getPaths( req, 'error' )
	});
});

/*** ROUTE FUNCTIONS ***/
function indexAction( req, res ) {

	res.render( 'pages/index', {
		title: 'BringSides',
		paths: assets.getPaths( req, 'app' )
	});
}

/*** MAIN ROUTES ***/
var indexRoutes = [
	'/'
];

_.each( indexRoutes, function( route ) {
	app.get( route, indexAction );
});

app.get( '/files', function( req, res ) {

//	rackspace.deleteFile( "assets/test/video.mp4", function() {
		rackspace.listFiles( function( err, files ) {
			res.json( files );
		})
//	})

})

app.post('/upload', function( req, res ) {

	var form = new formidable.IncomingForm();

	form.onPart = function( part ) {

		if ( !part.filename ) {
			// let formidable handle all non-file parts
//			form.handlePart( part );
		}
		else {
			part.pipe( rackspace.createUpload( part.filename, function( err, result ) {
				console.log( err, result )
			}))

			part.on( 'data', function() {
				console.log( 'data' );
			})
		}
	};

	form.parse( req );
	res.send( 'OK!' );
});