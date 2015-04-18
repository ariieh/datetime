exports.home = function(req, res, next) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
}
