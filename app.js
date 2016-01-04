/**
 * Created by silviu on 1/4/16.
 */

if(Meteor.isClient) {


    angular.module('socially', ['angular-meteor']);

    angular.module('socially').controller('PartiesListCtrl', PartiesListCtrl);

    PartiesListCtrl.$inject = ['$scope'];

    function PartiesListCtrl($scope) {

        $scope.parties = [
            {
                'name': 'Dubstep-Free Zone',
                'description': 'Can we please just for an evening not listen to dubstep.'
            },
            {
                'name': 'All dubstep all the time',
                'description': 'Get it on!'
            },
            {
                'name': 'Savage lounging',
                'description': 'Leisure suit required. And only fiercest manners.'
            }
        ];

    }

}