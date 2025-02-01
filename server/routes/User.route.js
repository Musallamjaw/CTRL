const express = require('express');
const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getCountUsers,
  addUserByAdmin
} = require('../controller/User.controller.js');
const { verifyAdminToken } = require('../middleware/verifyAdminToken.js');

const router = express.Router();

router.get('/all/:page', verifyAdminToken, getAllUsers);
router.get('/count', verifyAdminToken, getCountUsers);
router.get('/:userId', getUserById);
router.post('/addUser', verifyAdminToken, addUserByAdmin)
router.put('/:userId', verifyAdminToken, updateUser);
router.delete('/:userId', verifyAdminToken, deleteUser)


module.exports = router;