var User = require('../models/user');

exports.create = function(req, res, next) {
    User.create({
        name: req.body['name']
    }, function (err, user) {
        if (err) return next(err);
        res.redirect('/users/' + user.id);
    });
};
