angular.module( 'directives', [] )

	.directive( 'windowResize', [ '$document', '$window', function ( $document, $window ) {

		return {
			restrict: 'A',
			link: function( scope ) {

				var win = $( $window );

				function setValues() {
					scope.windowWidth = $document.width();
					scope.windowHeight = win.height();
					scope.isMobile = ( scope.windowWidth < 768 );
					scope.isTablet = ( scope.windowWidth >= 768 && scope.windowWidth < 992 );
					scope.$broadcast( 'resize', scope.windowWidth, scope.windowHeight );
				}

				setValues();

				win.bind( 'resize', function () {
					scope.$apply( setValues );
				});
			}
		}
	}])

	.directive( 'viewportHeight', [ function () {
		return {
			restrict: 'A',
			link: function( scope, element ) {

				function getPadding() {
					return scope.isMobile ? 110 : 150;
				}

				scope.$on( 'resize', function( ev, width, height ) {

					var newHeight = height - getPadding();
					element.removeAttr( 'style' );

					if ( element.height() < newHeight ) {
						element.css({ height: newHeight });
					}
				});
			}
		}
	}])

	.directive( 'bsMenu', [ '$location', '$timeout', function( $location, $timeout ) {
		return {
			restrict: 'A',
			scope: true,
			link: function( scope, element, attrs ) {

				function select( currentElement ) {

					currentElement
						.addClass( 'active' )
						.siblings().removeClass( 'active' );
				}

				function autoUpdate() {

					// if the change came from this menu, don't do anything
					// this helps prevent unnecessary CPU cycles
					if ( scope.internalRouting ) {
						scope.internalRouting = false;

						// mobile bug, sometimes need to set it twice
						$timeout( function() {
							scope.internalRouting = false;
						}, 500 );

						return;
					}

					var triggers = element.find( 'li' );
					var location = $location.path();
					var current = _.find( triggers, function( a ) {
						return location === $( a ).attr( 'rel' );
					});

					if ( current ) {
						select( $( current ) );

						// let the controller know the menu was auto-updated
						scope.$emit( 'menu-updated' );
					}
					else {
						triggers.removeClass( 'active' );
					}
				}

				element.on( 'touchstart click', 'li', function() {

					var el = $( this );

					scope.internalRouting = true;

					// let the controller know the click came from inside
					scope.$emit( 'menu-clicked' );

					select( el );

					scope.$apply( function() {
						$location.path( el.attr( 'rel' ) );
					});
				});

				// watch for change in location and update menu
				scope.$on( '$routeChangeSuccess', autoUpdate );
			}
		}
	}])

	.directive( 'sideItem', [ '$timeout', function( $timeout ) {
		return {
			restrict: 'E',
			templateUrl: 'templates/partial-side-item.html',
			scope: {
				side: '=',
				editable: '='
			},
			controller: 'SideItemCtrl',
			link: function( scope, element ) {

				element.on( 'click', '.delete-side', function( ev ) {

					ev.preventDefault();

					if ( confirm( 'Are you sure you want to delete "'+ scope.side.description + '"?')) {

						element.hide( 300 );

						$timeout( function() {
							scope.deleteSide();
						}, 500 );
					}
				});

				element.on( 'click', '.select-side', function( ev ) {

					ev.preventDefault();

					if ( scope.side.status !== 'selected' || scope.editable && confirm( 'Are you sure you want to deselect "'+ scope.side.description + '"?') ) {

						scope.$apply( function() {
							scope.side[ 'loading' ] = true;
							scope.toggleSelected();
						});
					}
				});
			}
		}
	}])

	.directive( 'bsMenuScroller', [ function() {
		return {
			restrict: 'A',
			link: function( scope, element ) {
				scope.$on( 'menu-updated', function() {
					element.scrollTop( 0 );
				});
			}
		}
	}])

	.directive( 'pushLink', [ '$location', function( $location ) {
		return {
			restrict: 'E',
			link: function( scope, element, attrs ) {
				scope.go = function() {
					$location.path( attrs[ 'path' ] );
				};
			}
		}
	}])

	.directive( 'bsLoader', [ function() {
		return {
			restrict: 'E',
			template: '<div class="loading ng-cloak"><div class="filter"></div><i class="fa fa-spinner fa-spin"></i></div>',
			replace: true
		}
	}]);
