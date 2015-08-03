var crypto = require('crypto');
var db = require('./db.js');

var createHash = function(message) {
  var cipher = crypto.createCipher('blowfish', message);
  return(cipher.final('hex'));
};

var check = function(job, cb) {
  var hash = createHash(JSON.stringify(job));
  db.get(hash, function(err, doc) {
    return cb(err, !!doc);
  });
};

var populate = function(job, cb) {
  var hash = createHash(JSON.stringify(job));
  db.put(hash, function(err) {
    return cb(err);
  });
};

var noFalsies = function(item) {
  return item;
};

module.exports = {
  filter: function(jobs, cb) {
    var res = [];
    var errs = [];
    jobs.forEach(function(job) {
      check(job, function(err, exists) {
        errs.push(err);
        if (!exists) res.push(job);
        if (errs.length === jobs.length) return cb(errs.filter(noFalsies), res);
      });
    });
  },
  populate: function(jobs, cb) {
    var errs = [];
    jobs.forEach(function(job) {
      populate(job, function(err) {
        errs.push(err);
        if (errs.length === jobs.length && cb) return cb(errs);
      });
    });
  }
};
