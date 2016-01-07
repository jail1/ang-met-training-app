/**
 * Created by vash-dev on 1/7/16.
 */

angular.module('socially').directive('partyDetails', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/parties/party-details/parties-details.html',
        controllerAs: 'partyDetails',
        controller: function($scope, $stateParams, $reactive) {

            $reactive(this).attach($scope);

            this.helpers({
                    // # Get the parties to be consumed.
                    party: () => {
                        return Parties.findOne({
                            _id: $stateParams.partyId
                    });
                }
            })

            // # Save changes made to party.
            this.save = () => {
                Parties.update({ _id : $stateParams.partyId }, {
                    $set : {
                        name : this.party.name,
                        description : this.party.description
                    }
                }, function(error) {
                    if(error) {
                        throw new Meteor.Error('Something happened !', error);
                    }
                    console.info('Party modified with success !');
                });
            }

        }
    }
});