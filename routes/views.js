exports.home = function(req, res, next) {
  res.render('index', {
    FB_APP_ID: process.env.FB_APP_ID
  });
}
