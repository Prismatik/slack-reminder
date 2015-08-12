var Slack = require('slack-node');
slack = new Slack(process.env.SLACK_TOKEN);

var getReactions = function(user, cb) {
  var jobs = [];

  slack.api('reactions.list', {user: user}, function(err, response) {
    if (err) return cb(err);
    response.items.forEach(function(item) {
      var type = null;
      if (item.message) type = 'message';
      if (item.file) type = 'file';
      if (!type) return;
      item[type].reactions.forEach(function(reaction) {
        if (reaction.name === process.env.RESPONSE)
          reaction.users.forEach(function(user) {
            jobs.push({
              user: user,
              trigger: reaction.name,
              message: {
                permalink: item[type].permalink,
                text: item[type].text,
                user: item[type].user
              }
            });
          });
      });
    });

    return cb(null, jobs);
  });
};

var getUsers = function(cb) {
  var users = {};
  slack.api('users.list', function(err, response) {
    if (err) return cb(err);
    response.members.forEach(function(member) {
      users[member.id] = {
        name: member.name,
        email: member.profile.email
      };
    });
    return cb(null, users);
  });
};

module.exports = {
  getReactions: getReactions,
  getUsers: getUsers
};
