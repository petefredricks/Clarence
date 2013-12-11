angular.module( 'services', [] )
	.factory( 'Util', [ '$rootScope', function( $rootScope ) {
		return {
			promiseHandler: function( promise, callback ) {
				promise
					.success( function( data ){
						callback( null, data );
					})
					.error(function( data ){
						callback( data );
					});
			},
			broadcast: function() {
				$rootScope.$broadcast.apply( $rootScope, arguments );
			},
			handleError: function ( err ) {
				switch ( err ) {
					case 'Not authenticated':
						location.href = '/login?error=authenticated';
				}
			}
		};
	}]);