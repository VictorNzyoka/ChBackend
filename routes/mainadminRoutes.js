const express = require('express');
const { verifyToken, isMainAdmin } = require('../middleware/auth');
const { getPendingUsers, updateUserStatus,createGroup } = require('../controllers/mainAdminController');

const router = express.Router();


router.get('/pending', getPendingUsers);
router.patch('/approve/:uuid',verifyToken,isMainAdmin, updateUserStatus);
router.patch('/create', createGroup);

module.exports = router;
