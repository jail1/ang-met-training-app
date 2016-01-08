/**
 * Created by vash-dev on 1/7/16.
 */

angular.module('socially').directive('partyDetails', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/parties/party-details/parties-details.html',
        controllerAs: 'partyDetails',
        controller: function($scope, $stateParams, $reactive) {

            // # Bind the context of this constructor (controller) to the $scope to make a reactive context.
            $reactive(this).attach($scope);

            // # Subscribe to the `users` collection as per the publication.
            this.subscribe('users');
            // # Subscribe tot the `parties` collection as per the publication.
            this.subscribe('parties');

            this.helpers({

                // # Get the parties to be consumed.
                party: () => {
                        return Parties.findOne({
                            _id: $stateParams.partyId
                    });
                },

                // # Get the users with the specified fields data (in the subscribe).
                users: () => {
                    return Meteor.users.find();
                }

            });

            // # Save changes made to party.
            this.save = () => {
                Parties.update({ _id : $stateParams.partyId }, {
                    $set : {
                        name : this.party.name,
                        description : this.party.description,
                        'public' : this.party.public
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