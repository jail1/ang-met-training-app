/**
 * Created by silviu on 1/9/16.
 */

angular.module('socially').filter('uninvited', uninvited);

function uninvited () {
    return function( users, party ) {

        if ( !party ) {
            return false;
        }

        return _.filter(users, function(user) {
            return !( user._id == party.owner || _.contains(party.invited, user._id) );
        });

    }
}