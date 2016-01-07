/**
 * Created by vash-dev on 1/7/16.
 */

angular.module('socially').config(configFunction);

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
            template: '<party-details></party-details>'
        });

    // # Define a de-facto route; will use this as a redirect in case the entered url does not match any of the above defined states.
    $urlRouterProvider.otherwise('/parties');

}