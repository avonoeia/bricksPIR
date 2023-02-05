const User = require('../models/userModel')
const Project = require('../models/projectModel')
const jwt = require('jsonwebtoken')

// Utility function that returns a token
function createToken(id) {
    return jwt.sign({id}, process.env.SECRET)
}


// Handling signup request from a new user
async function userSignup(req, res) {
    const { email, password, name, position, access } = req.body
    console.log({...req.body})

    try {
        const newUser = await User.signup(email, password, name, position, access) // Access array should be empty.

        const token = createToken(newUser._id)

        res.status(200).json({email, token})
    } catch (err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }
}

// Handling login request from an existing user
async function userLogin(req, res) {
    const {email, password} = req.body

    console.log("Hit registered at userLogin controller")

    try {
        const user = await User.login(email, password)

        const token = createToken(user._id, '30d')

        res.status(200).json({email, name: user.name, user_id: user._id, position: user.position, token})
    } catch (err) {
        console.log(err)
        res.status(401).json({error: err.message})
    }
}

// Get all user information 
async function getUsers(req, res) {
    const { position } = req.user

    if (position !== "admin") {
        return res.status(403).json({ "error": "Unauthorized" })
    }

    const users = [...await User.find()]

    if (users) {
        res.status(200).json({ users_list: users })
    }
}

// Get user info for profile page
async function getUserInfo(req, res) {
    const { _id } = req.user

    try {
        const user = await User.findOne({ _id: _id })
        return res.status(200).json({ user_details: {...user} })
    } catch(err) {
        console.log(err)
    }
}

// Grant access to users
async function grantAccess(req, res) {
    const { user_id, project_id } = req.body
    const { position } = req.user

    if (position != 'admin') {
        return res.status(401).json({ error: "Admin privileges required to grant access to users. Your request cannot be processed."})
    }

    try {
        let filter = { _id: user_id }
        const oldUser = await User.findOne(filter)
        const user = await User.findOneAndUpdate(filter, { access: [...oldUser.access, project_id]}, {new: true})

        filter = {_id: project_id}
        const oldProject = await Project.findOne(filter)
        const newRoles = oldProject.roles
        newRoles[user.position].push(user_id)
        const project = await Project.findOneAndUpdate(filter, { roles: newRoles }, {new: true})

        res.status(200).json({message: `User ${user.name} granted access to project ${project.project_name}.`, project})
    } catch(err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports = { userSignup, userLogin, getUsers, getUserInfo, grantAccess }