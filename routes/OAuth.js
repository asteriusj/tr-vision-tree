var OAuth = require('../lib/oauth'),
    googleapis = require('googleapis');

/** Login page */
exports.login = function(req, res) {
  console.log("login");
  if (!req.session.oauth_access_token) {
    console.log("no oauth_access_token");
    var redirectUrl = "/oauth/oauth-login?destination=" + (req.query.destination || "/");
    console.log('redirectUrl',redirectUrl);
    return res.redirect(redirectUrl);
  } else {
    console.log("found oauth_access_token");
    var destination = req.query.destination || "/";
    console.log('destination',destination);
    return res.redirect(destination);
  }
};

/** Logout handler */
exports.logout = function(req, res) {
  console.log("logout");
  req.session.destroy();
  res.redirect("/");
};

/** OAuth login redirect */
exports.oauth_login = function(req, res) {
  console.log("oauth_login redirect");

  var OAuthClient = OAuth.GetOAuthClient(req);

  var destination = req.query.destination ? req.query.destination : "/";
  console.log('destination',destination);

  // get the URL to redirect to
  return res.redirect(
    OAuthClient.generateAuthUrl({
      access_type: 'offline',
      //approval_prompt: 'force', // refresh_token is only available when they hit accept, use this to get a refresh token every time (for development)
      scope: OAuthClient.scope,
      state: destination
    })
  );
};

/** OAuth callback handler */
exports.oauth_callback = function(req, res) {
  console.log("oauth_callback");

  var code = req.param('code');
  console.log("code", code);

  var destination = req.param('state'); // contains destination URL

  if (code) {
    console.log("requesting access token");

    var OAuthClient = OAuth.GetOAuthClient(req);

    OAuthClient.getToken(code, function(err, tokens) {
      console.log("oauth_callback auth.getToken");

      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return res.send(err);
      }

      console.log("tokens", tokens);
      console.log("access_token");
      console.log(tokens.access_token);
      console.log("refresh_token");
      console.log(tokens.refresh_token);

      req.session.oauth_access_token = tokens.access_token;
      req.session.oauth_refresh_token = tokens.refresh_token;
      req.session.oauth_expires_in = tokens.expires_in;
      req.session.oauth_token_type = tokens.token_type;

      console.log('destination',destination);
      return res.redirect(destination || "/");
    });
  } else {
    // user may have denied request
    var error = req.param('error');
    console.log("error", error);
    res.send(error);
  }
};