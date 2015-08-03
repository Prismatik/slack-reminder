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

var go_rocketship_go = function() {
  slack.getUsers(function(err, users) {
    if (err) throw err;
    slack.getReactions(function(err, jobs) {
      if (err) throw err;
      var populated = populateJobs(jobs, users);
      cache.filter(jobs, function(errs, jobs) {
        if (errs.length) console.error(errs);
        sendEmails(jobs, function(errs, sent) {
          if (errs.length) console.error(errs);
          cache.populate(sent);
        });
      });
    });
  });
};

setInterval(go_rocketship_go, process.env.INTERVAL);
go_rocketship_go();
