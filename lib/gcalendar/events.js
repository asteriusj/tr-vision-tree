var googleapis = require('googleapis');

/** Get list of events for a calendar
 *
 * @param {Function} cb  Callback function(EventsArray){...}
 */
exports.list = function(calendarId, OAuthClient, cb) {
  googleapis.discover('calendar', 'v3').execute(function(err, client) {
    if (err) {
      console.log('error', err);
      cb(err);
    }

    client.calendar.events.list({
      calendarId: encodeURIComponent(calendarId)
    })
    .withAuthClient(OAuthClient)
    .execute(function(err, body, resp) {
        if (err) {
          console.log('error', err);
          cb(err);
        }

        cb(null, body.items);
      });
  });
}

/** Add a new event to a calendar.
 *
 * @param {string} calendarId  Calendar ID.
 * @param {EventModel} event  The event to add.
 * @param {OAuthClient} OAuthClient  An authorized OAuth client.
 * @param {Function} cb  Callback function(eventId){...}
 */
exports.add = function(calendarId, event, OAuthClient, cb) {
  googleapis.discover('calendar', 'v3').execute(function(err, client) {
    if (err) {
      console.log('error', err);
      cb(err);
    }

    client.calendar.events.insert({
      calendarId: encodeURIComponent(calendarId)
    },{
      summary: event.summary,
      location: event.location,
      start: {
        dateTime: event.start.toISOString()
      },
      end: {
        dateTime: event.end.toISOString()
      }
    })
    .withAuthClient(OAuthClient)
    .execute(function(err, body, resp) {
        if (err) {
          console.log('error', err);
          cb(err);
        }

        cb(null, body.id);
      });
  });
}
