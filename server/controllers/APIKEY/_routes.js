const express = require('express');
const apikey = require('./APIKEY');
const auth = require('../../middleware/auth');

const router = express.Router();


router.post('/apiupdate', auth, apikey.apiupdate)
router.post('/view',auth,apikey.viewApikey)
router.post('/sendgooglecode', auth, apikey.GoogleOauth)
router.post('/unlinkgoogleaccount', auth, apikey.unlinkGoogleAccount)

module.exports = router