const nodemailer = require('nodemailer');
const {readFile} = require('fs');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
} = process.env;
const Mailing = {};
const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    OAUTH_PLAYGROUND
);


module.exports = function (email) {
    return new Promise(async (resolve, reject) => {

        oauth2Client.setCredentials({
            refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
        });
    
        const accessToken = await oauth2Client.getAccessToken();
    
        const smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: SENDER_EMAIL_ADDRESS,
                clientId: MAILING_SERVICE_CLIENT_ID,
                clientSecret: MAILING_SERVICE_CLIENT_SECRET,
                refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
                accessToken,
            },
        });
    
        const filePath = `${global.appRoot}\\www\\reject.html`;
    
        readFile(filePath, 'utf8', function(err, html){
            if(err) reject(err);
            const mailOptions = {
                from: SENDER_EMAIL_ADDRESS,
                to: email,
                subject: "Your aplication has been reject",
                html: html,
            };
            smtpTransport.sendMail(mailOptions, (err, info) => {
                if (err) reject(err);
                resolve(info)
            });
        });
    })
}