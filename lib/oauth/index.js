var googleapis = require('googleapis'),
    config = require('../config');

/** Gets a Google OAuth Client */
function GetOAuthClient(req) {

  // OAuth 2.0 web application Credentials for "API Project"
  // https://cloud.google.com/console?redirected=true#/project/344637897208/apiui/credential
  var GoogleOAuth2Client = new googleapis.auth.OAuth2(
    config.GoogleOAuth.ClientID,
    config.GoogleOAuth.ClientSecret,
    config.GoogleOAuth.RedirectURI
  );
  GoogleOAuth2Client.scope = config.GoogleOAuth.Scope;

  GoogleOAuth2Client.credentials = {
    access_token: req.session.oauth_access_token,
    refresh_token: req.session.oauth_refresh_token
  };

  return GoogleOAuth2Client;
};

/** Route middleware handler that checks for OAuth credentials, and creates OAuth Client instance. */
exports.RequireOAuth = function(req, res, next) {
  if (!req.session.oauth_access_token) {
    var redirectUrl = "/login?destination=" + req.originalUrl;
    return res.redirect(redirectUrl);
  }

  req.OAuthClient = GetOAuthClient(req);

  // proceed to the next handler
  return next();
}

exports.GetOAuthClient = GetOAuthClient;