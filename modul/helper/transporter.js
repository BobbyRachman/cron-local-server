var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 465,
    auth: {
        user: 'support@egogohub.com',
        pass: 'P@ssword12345'
    }, 
    tls: {rejectUnauthorized: false}
})

module.exports = transporter