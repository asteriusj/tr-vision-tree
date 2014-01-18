var GDrive = require('../lib/gdocs/drive'),
    models = require('../models');

exports.form = function(req, res) {
  var viewData = {
    title: 'DocBook',
    authenticated: req.session.oauth_access_token ? true : false
  };
  return res.render('docbook-form', viewData);
};

exports.create = function(req, res) {
  var document = models.Document({
    title: req.body.title,
    body: req.body.bodyCopy
  });

  GDrive.createDocBook(document,req.OAuthClient,function(err, body, resp) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    return res.redirect("/");
  });
};