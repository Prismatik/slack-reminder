require('required_env')(require('./required_env_vars'));
var email = require('./lib/email.js');
var cache = require('./lib/cache.js');
var slack = require('./lib/slack.js');

var populateJobs = function(jobs, users) {
  jobs = jobs.map(function(job) {
    job.user = users[job.user];
    job.message.user = users[job.message.user];
    return job;
  });
  return jobs;
};

var sendEmails = function(jobs, cb) {
  if (jobs.length === 0) return cb([], []);
  var errs = [];
  var sent = [];

  jobs.forEach(function(job) {
    email(job, function(err) {
      if (err) {
        errs.push(err);
      } else {
        sent.push(job);
      }
      if (errs.length + sent.length === jobs.length) {
        return cb(errs, sent);
      }
    });
  });
};

var filterExtraneousUsers = function(user) {
  return function(job) {
    return (job.user === user);
  };
};

var act_for_user = function(user, users) {
  slack.getReactions(user, function(err, jobs) {
    if (err) throw err;
    var filtered = jobs.filter(filterExtraneousUsers(user));
    var populated = populateJobs(filtered, users);
    cache.filter(populated, function(errs, uncached) {
      if (errs.length) console.error(errs);
      sendEmails(uncached, function(errs, sent) {
        if (errs.length) return console.error(errs);
        cache.populate(sent);
      });
    });
  });
};

var go_rocketship_go = function() {
  slack.getUsers(function(err, users) {
    if (err) throw err;
    for (user in users) {
      act_for_user(user, users);
    };
  });
};

setInterval(go_rocketship_go, process.env.INTERVAL);
go_rocketship_go();
