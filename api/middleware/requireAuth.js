const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

async function requireAuth(req, res, next) {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: "Authentication token required. Access denied."})
    }

    const token = authorization.split(' ')[1]
    try {
        const { id } = jwt.verify(token, process.env.SECRET)
        req.user = await User.findOne({ _id: id }).select('_id name position access')
        next() 
    } catch(err) {
        console.log(err)
        res.status(400).json({ error: "Invalid authentication token. Access denied." })
    }
}

module.exports = requireAuth