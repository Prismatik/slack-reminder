module.exports = [
  {
    var: 'NODEMAILER_SERVICE',
    default: 'Gmail'
  },
  {
    var: 'EMAIL_FROM',
    default: 'slackreminder@'+process.env.DOMAIN
  },
  'EMAIL_USER',
  'EMAIL_PASS',
  'DOMAIN',
  'SLACK_TOKEN',
  {
    var: 'RESPONSE',
    default: 'remindme'
  },
  'COUCH_URL',
  {
    var: 'INTERVAL',
    default: 10 * 60 * 1000
  }
];
