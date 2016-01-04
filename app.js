/**
 * Created by silviu on 1/4/16.
 */

Parties = new Mongo.Collection("parties");

if(Meteor.isClient) {


    angular.module('socially', ['angular-meteor']);

    angular.module('socially').directive('partiesList', partiesList);

    function partiesList () {
        return {
            restrict        : 'E',
            templateUrl     : 'parties-list.html',
            controllerAs    : 'partiesList',
            controller      : function($scope, $reactive) {

                // # Bind the scope to the current context, and make it a reactive value.
                $reactive(this).attach($scope);

                this.newParty = {  };

                this.helpers({
                    parties : () => {
                        return Parties.find({  });
                    }
                })

                this.addParty = () => {
                    Parties.insert(this.newParty);
                    this.newParty = {  };
                }

                this.removeParty = (party) => {
                    Parties.remove({ _id : party._id });
                }

            }
        }
    }

}