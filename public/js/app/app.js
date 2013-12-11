angular.module( 'uploader', [ 'directives', 'services', 'filters', 'ui.bootstrap', 'angularFileUpload' ])

	.controller( 'AppCtrl', [ '$rootScope', 'Util', function( $rootScope, Util ) {

		$rootScope.$on( "$routeChangeError", function( event, current, previous, rejection ) {
			Util.handleError( rejection.data );
		});

	}])

	.controller( 'UploadCtrl', [ '$scope', '$upload', function( $scope, $upload ) {

		$scope.onFileSelect = function($files) {

			for (var i = 0; i < $files.length; i++) {

				var $file = $files[i];

				$scope.upload = $upload.upload({
					url: '/upload',
					data: {
						myObj: $scope.myModelObj
					},
					file: $file
				})
				.progress(function(evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				})
				.success(function(data, status, headers, config) {
					// file is uploaded successfully
					console.log(data);
				});
			}
		};

	}])