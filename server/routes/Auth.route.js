const express = require('express')
const router = express.Router()
const { signUp, logIn, logOut, refresh, verifyCode, forgotPassword, resetPassword } = require('../controller/Auth.controller')

router.post('/signUp', signUp)
router.post('/logIn', logIn)
router.post('/refresh', refresh)
router.post('/logOut', logOut)
router.post('/verifyCode', verifyCode);
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)
module.exports = router