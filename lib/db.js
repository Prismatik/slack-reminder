var request = require('request');

module.exports = {
  get: function(hash, cb) {
    request.get(process.env.COUCH_URL + '/' + hash, function(err, res, body) {
      if (err) return cb(err);
      if (res.statusCode === 404) return cb(null, false);
      cb(null, body);
    });
  },
  put: function(hash, cb) {
    request.put(process.env.COUCH_URL + '/' + hash, {json: {seen: true}}, function(err, res, body) {
      return cb(err);
    });
  }
}
