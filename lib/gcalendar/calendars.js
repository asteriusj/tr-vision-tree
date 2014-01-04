var TROAuth = require('../oauth'),
    googleapis = require('googleapis');

/** Get list of calendars
 *
 * @param {Function} cb  Callback function(CalendarsArray){...}
 */
exports.list = function(OAuthClient, cb) {
  googleapis.discover('calendar', 'v3').execute(function(err, client) {
    if (err) {
      console.log('error', err);
      cb(err);
    }

    client.calendar.calendarList.list()
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

/** Create a new calendar.
 *
 * @param {Function} cb  Callback function(CalendarId){...}
 */
exports.create = function(title, OAuthClient, cb) {
  googleapis.discover('calendar', 'v3').execute(function(err, client) {
    if (err) {
      console.log('error', err);
      cb(err);
    }

    client.calendar.calendars.insert({
        summary: title
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