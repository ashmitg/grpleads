const express = require('express');
const contact = require('./contact');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/', auth, contact.index)
router.post('/add', auth, contact.add)
router.post('/bulkadd', auth, contact.bulkadd)
router.post('/add-property-interest/:id', auth, contact.addPropertyInterest)
router.get('/view/:id', auth, contact.view)
router.put('/edit/:id', auth, contact.edit)
router.delete('/delete/:id', auth, contact.deleteData)
router.post('/deleteMany', auth, contact.deleteMany)


module.exports = router