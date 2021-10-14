const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')
const AuthJwt = require("../controllers/auth-jwt");

const router = express.Router()

router.post('/user', UserCtrl.createUser)
router.post('/update_user', [AuthJwt.verifyToken], UserCtrl.updateUser)
router.post('/update_user_status', [AuthJwt.verifyToken], UserCtrl.updateUserStatus)
router.delete('/user/:id', [AuthJwt.verifyToken], UserCtrl.deleteUser)
router.get('/user/:id', [AuthJwt.verifyToken], UserCtrl.getUserById)
router.get('/users', [AuthJwt.verifyToken], UserCtrl.getUsers)
router.get('/get_inactive_users/:minutes', [AuthJwt.verifyToken], UserCtrl.getInactiveUsers)
router.post('/login', UserCtrl.loginUser)

module.exports = router