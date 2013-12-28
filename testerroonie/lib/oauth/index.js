var googleapis = require('googleapis');

/** Gets a Google OAuth Client */
function GetOAuthClient(req) {

  // OAuth 2.0 web application Credentials for "API Project"
  // https://cloud.google.com/console?redirected=true#/project/344637897208/apiui/credential
  var GoogleOAuth2Client = new googleapis.auth.OAuth2(
    '344637897208-f7p67hnrk1d7ov25i1ngh800cevi5t0q.apps.googleusercontent.com', // client_id
    'DoSXgzR_LfM0BZEogG_caaX7', // client_secret
    'http://localhost:5000/oauth/oauth-callback' // redirect_uri
  );
  GoogleOAuth2Client.scope = ["https://spreadsheets.google.com/feeds",
                              "https://www.googleapis.com/auth/calendar",
                              "https://www.googleapis.com/auth/drive"].join(" ");

  GoogleOAuth2Client.credentials = {
    access_token: req.session.oauth_access_token,
    refresh_token: '1/Bs1MPXbbViPtg1NzEFJ_31lWdLdStx28EBx1K5IfejA' //req.session.oauth_refresh_token
  };

  // testeroonie@gmail.com's tokens
  //GoogleOAuth2Client.credentials = {
  //  access_token: 'ya29.1.AADtN_Xby9RTXaud_LfZGPlGZCr0nJj9EkYXvDufcK2E0UYyPhnqKDgsqWlnWUD53s45sA',
  //  refresh_token:
  //};

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