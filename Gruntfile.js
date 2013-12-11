module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON( __dirname + '/package.json' ),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},

			cms: {

				// Used for both the optimized and unoptimized version of media tool and media player

				files: {
					'public/<%= pkg.version %>/js/app.js': [
						'public/js/lib/angular-file-upload.min.js',
						'public/js/lib/ui-bootstrap-tpls-0.7.0.js',
						'public/js/app/services.js',
						'public/js/app/directives.js',
						'public/js/app/filters.js',
						'public/js/app/app.js'
					]
				}
			}
		},

		cssjoin: {
			join : {

				// The index.css actually has a list
				// of import statements so if you need to add new files, it's easiest to just add
				// them to the index.css. The optimized build process will resolves those imports
				// into a single CSS file

				files: {
					'public/<%= pkg.version %>/css/app.css': [ 'public/css/index/app.css' ]
				}
			}
		},
		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'public/', src: [ 'fonts/**', 'images/**' ], dest: 'public/<%= pkg.version %>/' }
				]
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-cssjoin' );

	// Default task(s).
	grunt.registerTask( 'default', [ 'uglify', 'cssjoin' ] );
	grunt.registerTask( 'build', [ 'uglify', 'cssjoin', 'copy' ]);

};