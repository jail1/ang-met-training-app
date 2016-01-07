/**
 * Created by vash-dev on 1/7/16.
 */

angular.module('socially')
    .config(configFunction)
    .run(runFunction);

function configFunction($urlRouterProvider, $stateProvider, $locationProvider) {

    // # Enable html5mode.
    $locationProvider.html5Mode(true);

    // # Define our states.
    $stateProvider
        .state('parties', {
            url: '/parties',
            template: '<parties-list></parties-list>'
        })
        .state('partyDetails', {
            url: '/parties/:partyId',
            template: '<party-details></party-details>',
            resolve: {
                currentUser : ($q) => {
                    "use strict";
                    if(Meteor.userId() == null) {
                        return $q.reject();
                    } else {
                        return $q.resolve();
                    }
                }
            }
        });

    // # Define a de-facto route; will use this as a redirect in case the entered url does not match any of the above defined states.
    $urlRouterProvider.otherwise('/parties');

}

function runFunction($rootScope, $state) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

        // # Detect if it's our reject that caused the error.
        if(error === 'AUTH_REQUIRED') {
            $state.go('parties');
        }

    });

}