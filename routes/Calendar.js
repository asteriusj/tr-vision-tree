var TR = require('../testerroonie'),
    googleapis = require('googleapis');

exports.calendar_list = function(req, res) {
  TR.Calendars.list(req.OAuthClient,function(err, calendars) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    var viewData = {
      title: 'Calendars',
      authenticated: req.session.oauth_access_token ? true : false,
      calendars: calendars
    };

    return res.render('calendar-list', viewData);
  });
};

exports.calendar_create = function(req, res) {
  TR.Calendars.create(req.body.title, req.OAuthClient, function(err, calendarId) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    return res.redirect("/calendars/");
  });
};

exports.event_list = function(req, res) {

  var calendarId = req.params.calendarId;

  TR.Events.list(calendarId, req.OAuthClient, function(err, events) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    var viewData = {
      title: 'Events',
      authenticated: req.session.oauth_access_token ? true : false,
      events: events
    };

    return res.render('event-list', viewData);
  });
};