/**
 * Created by vash-dev on 1/8/16.
 */

Meteor.publish("users", function() {

    return Meteor.users.find({  }, {
        fields : { emails : 1, profile : 1 }
    });

});