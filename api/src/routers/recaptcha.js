const router = require('express').Router();
const { validateRecaptcha } = require('../controllers/recaptcha');

router.post('/', validateRecaptcha);

module.exports = router;
