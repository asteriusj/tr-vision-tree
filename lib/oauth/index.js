var googleapis = require('googleapis'),
    config = require('../config');

/** Gets a Google OAuth Client using tokens in the session */
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
exports.GetOAuthClient = GetOAuthClient;

/** Route middleware handler that checks for OAuth credentials, and creates OAuth Client instance. */
exports.RequireOAuth = function(req, res, next) {
  // if there is no access token
  if (!req.session.oauth_access_token) {
    // set tokens from config
    req.session.oauth_access_token = config.GoogleOAuth.UserCredentials.testeroonie.access_token;
    req.session.oauth_refresh_token = config.GoogleOAuth.UserCredentials.testeroonie.refresh_token;

    // redirect to request user's access_token from Google
    //console.log("redirect to request user's access_token from Google");
    //var redirectUrl = "/login?destination=" + req.originalUrl;
    //return res.redirect(redirectUrl);
  }

  req.OAuthClient = GetOAuthClient(req);

  /* googleapis will automaticaly refresh an access token and update the credentials
   * property of an OAuth client instance, so we need to update the session if necessary.
   */
  res.on('finish',function() {
    if (req.OAuthClient.credentials.access_token !== req.session.oauth_access_token) {
      console.log("access_token is updated, updating session");
      req.session.oauth_access_token = req.OAuthClient.credentials.access_token;

      // session is auto-saved in res.end, but thats already passed, so manual save here
      req.session.save();
    }
  });

  // proceed to the next handler
  return next();
};