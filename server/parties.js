/**
 * Created by vash-dev on 1/8/16.
 */

Meteor.publish("parties", function(options, searchString) {

    if ( !searchString || searchString == null ) {
        searchString = '';
    }

    // # Build the Mongo selector.

    let mongoSelector = {
        name : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
        $or : [
            {
                $and : [
                    {
                        "public" : true
                    },
                    {
                        "public" : {
                            $exists : true
                        }
                    }
                ]
            },
            {
                $and : [
                    {
                        owner : this.userId
                    },
                    {
                        owner : {
                            $exists : true
                        }
                    }
                ]
            }
        ]
    };

    Counts.publish(this, 'numberOfParties', Parties.find(mongoSelector), { noReady : true });

    return Parties.find(mongoSelector, options);

});