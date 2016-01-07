/**
 * Created by vash-dev on 1/7/16.
 */

// # Create the Parties mongo Collection.

Parties = new Mongo.Collection("parties");

// # Add CRUD rules to the above Collection.

Parties.allow({

    insert : function(userId, party) {
        // # Only allow party insertion if the user is logged in and is the owner of the party.
        return userId && party.owner === userId;
    },

    /*
        # fields    -> fields that have been modified.
        # modifier  -> what triggered the modification. ex: $set, $inc, and any other MongoDB modifier.
     */
    update : function(userId, party, fields, modifier) {
        // # Only allow party editing if the user is logged in and is the owner of the party.
        return userId && party.owner === userId;
    },

    remove : function(userId, party) {
        // # Only allow party removal if the user is logged in and is the owner of the party.
        return userId && party.owner === userId;
    }

});