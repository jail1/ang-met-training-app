/**
 * Created by vash-dev on 1/7/16.
 */

angular.module('socially').directive('partyDetails', partyDetails);

function partyDetails () {
    return {
        restrict    : 'E',
        templateUrl : 'client/parties/party-details/parties-details.html',
        controllerAs: 'partyDetails',
        controller  : partyDetailsController
    }
}

function partyDetailsController ($scope, $stateParams, $reactive) {

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
        },

        // # Return true if the user performing an action is logged in.
        isLoggedIn : () => {
            return Meteor.userId() !== null;
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
    };

    this.invite = ( user ) => {
        Meteor.call('invite', this.party._id, user._id, ( error, newParty ) => {
            if(error) {
                console.log('Oops, unable to invite !', error);
            } else {
                console.log('Invited ! New party is: ', newParty);
            }
        });
    };

    this.canInvite = () => {
        if ( !this.party )
            return this.false;

        return !this.party.public && this.party.owner === Meteor.userId();
    };

}