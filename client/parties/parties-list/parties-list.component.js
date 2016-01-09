/**
 * Created by vash-dev on 1/7/16.
 */

    angular.module('socially').directive('partiesList', partiesList);

function partiesList () {
    return {
        restrict        : 'E',
        templateUrl     : 'client/parties/parties-list/parties-list.html',
        controllerAs    : 'partiesList',
        controller      : partiesListController
    }
}

function partiesListController ($scope, $reactive) {

    // # Bind the scope to the current context, and make it a reactive value.
    $reactive(this).attach($scope);

    this.newParty = {  };

    // # Add pagination support. The follwing values will reflect under the options object passed to the parties publish.
    this.perPage = 3;
    this.page = 1;
    this.sort = {
        name : 1
    };
    this.orderProperty = '1';
    this.searthText = '';

    this.helpers({

        parties : () => {
            return Parties.find({  }, {
                sort : this.getReactively('sort')
            });
        },

        partiesCount : () => {
            return Counts.get('numberOfParties');
        }

    });

    this.updateSort = () => {

        this.sort = {
            name: parseInt(this.orderProperty)
        };

    };

    this.getPartyCreator = function(party) {

        if (!party) {
            return '';
        }

        let owner = Meteor.users.findOne(party.owner);

        if (!owner) {
            return 'nobody';
        }

        if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
            return 'me';
        }

        return owner;

    };

    // # Handle subscriptions

    this.subscribe("users");

    this.subscribe("parties", () => {
        return [
            {
                limit: parseInt(this.perPage),
                skip : parseInt( (this.getReactively('page') -1) * this.perPage ),
                sort : this.getReactively('sort')
            },
            this.getReactively('searchText')
        ];
    });

    // # Add handlers.

    this.addParty = () => {
        if(!this.newParty.name || !this.newParty.description) {
            angular.element('p#error').html('You need to insert something in both those fields!');
            textDiss(3000);
            throw new Meteor.Error('You need to insert something in both those fields!');
        }

        // # Decorate the newParty object with the current logged in user _id.
        // # Will use this for permissions later.
        this.newParty.owner = Meteor.user()._id;

        Parties.insert(this.newParty, function(error, result) {
            if(error) {
                return;
            }
            angular.element('p#error').html('Item added successfully!');
            textDiss(3000);
        });

        this.newParty = {  };
    };

    this.removeParty = (party) => {
        Parties.remove({ _id : party._id });
    };

    this.pageChanged = (newPage) => {
      this.page = newPage;
    };

}

function textDiss(time) {
    Meteor.setTimeout(function() {
        angular.element('p#error').html('');
    }, time);
}
