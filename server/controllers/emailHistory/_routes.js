const express = require('express');
const auth = require('../../middleware/auth');
const email = require('./email')

const router = express.Router();

router.get('/', auth, email.index)
router.get('/view/:id', auth, email.view)
router.post('/add', auth, email.add)
router.post('/addbulk', auth, email.bulkAdd)

module.exports = router