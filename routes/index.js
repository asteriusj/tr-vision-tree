

/** Homepage */
exports.index = function(req, res) {
  var viewData = {
    title: 'Transform Rockford Vision Tree Viewers',
    authenticated: req.session.oauth_access_token ? true : false
  };
  res.render('index', viewData);
};



