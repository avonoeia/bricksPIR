const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const { userSignup, userLogin, getUsers, getUserInfo, grantAccess } = require('../controllers/userController')

router.post('/signup', userSignup)
router.post('/login', userLogin)

router.use(requireAuth)

router.get('/', getUsers)
router.get('/profile', getUserInfo)
router.patch('/access-control', grantAccess)

module.exports = router