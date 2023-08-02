const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const { userSignup, userLogin, getUsers, getUserInfo, getUserDetails, grantAccess, removeAccess } = require('../controllers/userController')

router.post('/login', userLogin)

router.use(requireAuth)
router.post('/signup', userSignup)

router.get('/', getUsers)
router.get('/profile', getUserInfo)
router.get('/get-user/:user_id', getUserDetails)
router.patch('/access-control/add', grantAccess)
router.patch('/access-control/remove', removeAccess)

module.exports = router