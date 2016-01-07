/**
 * Created by vash-dev on 1/7/16.
 */

if(Meteor.isClient) {


    angular.module('socially').directive('partiesDetails', partiesDetails);

    function partiesDetails() {

        var returnable = {
            restrict        : 'E',
            templateUrl     : 'party-details.html',
            controllerAs    : 'partyDetails',
            controller      : function($scope, $stateParams) {

                this.partyId = $stateParams.partyId;

            }
        }

    }


}
