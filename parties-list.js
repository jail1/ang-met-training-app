/**
 * Created by vash-dev on 1/7/16.
 */

if(Meteor.isClient) {

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
                    if(!this.newParty.name || !this.newParty.description) {
                        angular.element('p#error').html('You need to insert something in both those fields!');
                        textDiss(3000);
                        throw new Meteor.Error('You need to insert something in both those fields!');
                    }
                    Parties.insert(this.newParty, function(error, result) {
                        if(error) {
                            return;
                        }
                        angular.element('p#error').html('Item added successfully!');
                        textDiss(3000);
                    });

                    this.newParty = {  };
                }

                this.removeParty = (party) => {
                    Parties.remove({ _id : party._id });
                }

            }
        }
    }

    function textDiss(time) {
        Meteor.setTimeout(function() {
            angular.element('p#error').html('');
        }, time);
    }

}