var nodemailer = require('nodemailer');
var crypto = require('crypto');

var transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

var formatMessage = function(message) {
  return [
    message.permalink,
    message.text,
    message.user.name
  ].join('\n')
};

var sendMail = function(job, cb) {
  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: job.user.email,
    subject: 'Slack Reminder',
    text: formatMessage(job.message)
  };
  transporter.sendMail(mailOptions, function(error){
    if(error) return cb(error);
    cb(null);
  });
};

module.exports = sendMail;
