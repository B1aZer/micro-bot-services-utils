const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport('smtps://blaze.imba@gmail.com:kcpppqefonecskkh@smtp.gmail.com');

// setup e-mail data with unicode symbols
const mailOptions = {
    from: '"Node Mailer" <blaze.imba@gmail.com>', // sender address
    to: 'kwerkee12@gmail.com', // list of receivers
    subject: '✖ Node App Has Crashed ✖', // Subject line
    text: 'Hello world ?', // plaintext body
};

module.exports = {
    transporter, mailOptions
}