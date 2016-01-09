/**
 * Created by silviu on 1/4/16.
 */

// # Angular app auto bootstrapper and dependency injection.

angular.module('socially', [

    'angular-meteor',
    'ui.router',
    'accounts.ui',
    'angularUtils.directives.dirPagination'

]);

function onReady() {
    angular.bootstrap(document, ['socially'], {
       strictDi : true
    });
}

if(Meteor.isCordova) {
    angular.element(document).on("deviceready", onReady);
} else {
    angular.element(document).ready(onReady);
}
