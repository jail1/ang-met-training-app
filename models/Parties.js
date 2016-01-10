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

let getContactEmail = function ( user ) {

    if ( user.emails && user.emails.length )
        return user.emails[0].address;

    if ( user.services && user.services.facebook && user.services.facebook.email )
        return user.services.facebook.email;

    return null;

};

Meteor.methods({

    invite : function ( partyId, userId ) {

        check ( partyId, String );

        check ( userId, String );

        // # Cache the current party.
        let party = Parties.findOne(partyId);

        if ( !party )
            throw new Meteor.Error(404, 'No such party found !');

        if ( party.owner !== this.userId )
            throw new Meteor.Error(403, 'No permission to do that !');

        if ( party.public )
            throw new Meteor.Error(400, 'That party is actually public. There is no need to invite any people !');

        if ( userId !== party.owner && !_.contains(party.invited, userId) ) {

            Parties.update(partyId, {
                $addToSet : { invited : userId }
            })

        }

        // ################################################################ end validations #

        let from = getContactEmail(Meteor.users.findOne(this.userId));

        let to = getContactEmail(Meteor.users.findOne(userId));

        if ( Meteor.isServer && to ) {
            Email.send({

                from : 'noreply@socially.com',
                to : to,
                replyTo : 'PARTY: ' + party.title,
                text :
                    "Hey, I just invited you to '" + party.name + "' on Socially." +
                    "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"

            });
        }

        return Parties.findOne(partyId);

    },

    rsvp : function ( partyId, rsvp ) {

        check ( partyId, String );

        check ( rsvp, String );

        if ( !this.userId )
            throw new Meteor.Error(403, 'You must be logged in !');

        if ( !_.contains(['yes', 'no', 'maybe'], rsvp) )
            throw new Meteor.Error(400, 'Invalid RSVP !');

        // # Cache the party.
        let party = Parties.findOne(partyId);

        if ( !party )
            throw new Meteor.Error(404, 'No such party !');

        if ( !party.public && party.owner !== this.userId && !_.contains(party.invited, this.userId) )
            throw new Meteor.Error(403, 'No such party !'); // # It's private, but let's not tell this to the user !

        // ################################################################ end validations #

        let rsvpIndex = _.indexOf(_.pluck(party.rsvps, 'user'), this.userId);

        if ( rsvpIndex !== -1 ) {

            // # Update the existing rsvp entry.
            if(Meteor.isServer) {

                // # Update the appropriate rsvp entry with $.
                Parties.update(
                    { _id : partyId, 'rsvps.user' : this.userId },
                    { $set : { "rsvps.$.rsvp" : rsvp } }
                );

            } else {
                // # Minimongo doesn't yet support $ in the modifiers.
                // # As a temporary workaround, make the modifier that uses an index.
                // # This is safe on the client since there's only one thread.

                let modifier = { $set : {  } };

                modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;

                Parties.update(partyId, modifier);
            }

        } else {
            // # Add the new RSVP entry.
            Parties.update(partyId, {

                $push: { rsvps: { user: this.userId, rsvp: rsvp } }

            });
        }

    }

});