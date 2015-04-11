var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
    process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'
);

var User = module.exports = function User(node) {
    this.node = node;
}

Object.defineProperty(User.prototype, 'id', {
	get: function() { return this.node._id; }
});

Object.defineProperty(User.prototype, 'name', {
    get: function () { return this.node.properties['name']; },
    set: function (name) { this.node.properties['name'] = name; }
});

User.create = function (data, callback) {
	db.cypher({
	    query: 'CREATE (user:User {data}) RETURN user',
	    params: {
	        data: data
	    }
	}, function (err, results) {
	    if (err) throw err;
        var user = new User(results[0]['user']);
        callback(null, user);
	});
};
