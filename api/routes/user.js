const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const { userSignup, userLogin, getUsers, getUserInfo, getUserDetails, grantAccess } = require('../controllers/userController')

router.post('/signup', userSignup)
router.post('/login', userLogin)

router.use(requireAuth)

router.get('/', getUsers)
router.get('/profile', getUserInfo)
router.get('/get-user/:user_id', getUserDetails)
router.patch('/access-control', grantAccess)

module.exports = router