var TROAuth = require('../oauth'),
    googleapis = require('googleapis');

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
      calendarId: calendarId
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
