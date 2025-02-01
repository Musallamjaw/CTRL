const express = require('express')
const router = express.Router()
const { sendContactForm } = require('../controller/contact.controller')

router.post('/', sendContactForm)

module.exports = router