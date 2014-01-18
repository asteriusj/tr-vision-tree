var googleapis = require('googleapis')
    models = require('../../models');

exports.createDocBook = function(document, OAuthClient, cb) {
  var docBookXML = document.getDocBookXML();

  googleapis.discover('drive', 'v2').execute(function(err, client) {
    client.drive.files.insert({
        title: document.title,
        mimeType: 'application/xml'
    })
    .withMedia('text/xml', docBookXML)
    .withAuthClient(OAuthClient)
    .execute(cb);
  });
}