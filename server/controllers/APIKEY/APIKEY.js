const User = require('../../model/schema/user');
const Apikey = require('../../model/schema/apikey');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
require('dotenv').config();


let encryptionKey = process.env.ENCRYPTION_KEY;



const encrypt = (text) => {
    const cipher = crypto.createCipher(algorithm, encryptionKey);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (text) => {
    const decipher = crypto.createDecipher(algorithm, encryptionKey);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};

async function getUserInfoWithAccessToken(accessToken) {
    try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!userInfoResponse.ok) {
            throw new Error('Failed to retrieve user information');
        }

        const userInfo = await userInfoResponse.json();
        return userInfo;
    } catch (error) {
        throw new Error(`Error retrieving user information: ${error.message}`);
    }
}

const exchangeRefreshTokenForAccessToken = async (refreshToken) => {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                refresh_token: refreshToken,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange refresh token for access token');
        }

        const tokenData = await response.json();
        return tokenData;
    } catch (error) {

        throw new Error(`Error exchanging refresh token for access token: ${error.message}`);
    }
};



const findUserAndApikey = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Find the Apikey by createdBy (user's ObjectId)
    let apikey = await Apikey.findOne({ createdBy: userId });

    if (!apikey) {
        apikey = new Apikey({ createdBy: userId });
        await apikey.save();
    }

    return { user, apikey };
};

const apiupdate = async (req, res) => {
    try {
        const newKey = req.body.key;
        const userId = req.user.userId;

        const { user, apikey } = await findUserAndApikey(userId);

        // Update the Apikey and Apidate
        apikey.GrouponApikey = newKey;
        apikey.GrouponApidate = new Date().toISOString();
        apikey.GrouponClientSecret = req.body.groupon_client_id;
        // Save the updated Apikey
        await apikey.save();


        res.status(200).json({ message: 'API key and date saved successfully', apikey });
    } catch (error) {
        console.error('Error saving API key and date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const viewApikey = async (req, res) => {

    try {
        const userId = req.user.userId;
        
        let request_return = req.body.request_return || false;
        
        const { user, apikey } = await findUserAndApikey(userId);
        let account = "";

        if(apikey.googRefreshToken.length>0 && apikey.googEmailAddress.length>0){
            try{
                response = await exchangeRefreshTokenForAccessToken(decrypt(apikey.googRefreshToken));
                account = apikey.googEmailAddress;
            }catch(error){
                apikey.googEmailAddress = "";
                apikey.googRefreshToken = "";
                await apikey.save();
                account = "Not configured";
            }
        }else{
            account = "Not configured";
        }

        if(request_return){
            res.status(200).json({
                GoogleAccount: account.length > 0 && account !== "Not configured",
            });
        }else{
            res.status(200).json({
                Apikey: apikey.GrouponApikey,
                GoogleAccount: account,
                groupon_client_id: apikey.GrouponClientSecret
            });
        }
    } catch (error) {
        console.error('Error fetching API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const GoogleOauth = async (req, res) => {
    try {

        const userId = req.user.userId;

        const { user, apikey } = await findUserAndApikey(userId);

        
        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    code: req?.body?.googlecode,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: "https://grpleads.com",
                    grant_type: 'authorization_code',
                }),
            });
            const tokenData = await response.json();
            console.log(tokenData, " tokendata")
            // Encrypt and save the refresh token
            const encryptedRefreshToken = encrypt(tokenData.refresh_token);
            apikey.googRefreshToken = encryptedRefreshToken;

            // Save the updated Apikey
            await apikey.save();

            const userInfo = await getUserInfoWithAccessToken(tokenData.access_token);
            if(userInfo && userInfo.email.length>0){
                const userEmail = userInfo.email;
                // Save the user's email address
                apikey.googEmailAddress = userEmail;
                await apikey.save();
                res.status(200).json({ message: 'Google Oauth saved successfully', GoogleAccount: userEmail });
            }

        } catch (error) {

            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const unlinkGoogleAccount = async (req, res) => {
    const userId = req.user.userId;

    const { user, apikey } = await findUserAndApikey(userId);

    try{
        apikey.googEmailAddress = "";
        apikey.googRefreshToken = "";
        await apikey.save();
        res.status(200).json({ message: 'Google Account Unlinked Successfully!' });
    }catch(error){

        res.status(500).json({ error: 'Internal server error' });
    }

}


module.exports = { apiupdate, viewApikey, GoogleOauth, unlinkGoogleAccount, encrypt, decrypt, findUserAndApikey, exchangeRefreshTokenForAccessToken };