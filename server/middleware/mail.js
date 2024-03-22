const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library/build/src/auth/oauth2client');
const {decrypt, exchangeRefreshTokenForAccessToken } = require('../controllers/APIKEY/APIKEY')
require('dotenv').config();


const createMessage = (sender, to, subject, body) => {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset="UTF-8"',
      '',
      body,
    ].join('\r\n');
  
    return Buffer.from(email).toString('base64');
  };
  
  // Function to initialize the Gmail API client
  const initializeGmailClient = async (apikey) => {
    try {
      const refreshToken = decrypt(apikey.googRefreshToken);
  
      const oauth2Client = new OAuth2Client({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: 'https://grpleads.com',
      });
  
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });
  
      // const accessTokenData = await exchangeRefreshTokenForAccessToken(refreshToken);
  
      // oauth2Client.setCredentials({
      //   access_token: accessTokenData.access_token,
      // });
  
      return google.gmail({
        version: 'v1',
        auth: oauth2Client,
      });
    } catch (error) {
      console.error('Error initializing Gmail client:', error.message);
      throw error;
    }
  };
  
  // Function to send an email
  const sendEmail = async (gmail, sender, recipient, subject, message) => {
    try {
      const rawMessage = createMessage(sender, recipient, subject, message);
  
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage,
        },
      });
  

    } catch (error) {
      console.error(`Error sending email to ${recipient}:`, error.message);
    }
  };


module.exports = {createMessage, initializeGmailClient, sendEmail }