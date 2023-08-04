
const User = require('../models/userModel')
const ObjectId = require('mongodb').ObjectId;

async function userAccessUpdator(roles, project_id) {
    const site_managers = roles.site_manager
    const data_entry_operators = roles.data_entry_operator
    const project_managers = roles.project_manager

    console.log(site_managers, data_entry_operators, project_managers)

    for (let i = 0; i < project_managers.length; i++) {
        const id = project_managers[i].split(" - ")[1]
        if (ObjectId.isValid(id.trim())) {
            const user = await User.findOne({ _id: id.trim() })
            if (user) {
                const newAccess = user.access
                newAccess.push(project_id)
                
                const newUser = await User.findOneAndUpdate({ _id: id }, {access: [...newAccess]}, { new: true })
                if (newUser) {
                    console.log("Updated access for user", newUser)
                }
            }
        }
    }

    for (let i = 0; i < site_managers.length; i++) {
        const id = site_managers[i].split(" - ")[1]
        if (ObjectId.isValid(id.trim())) {
            const user = await User.findOne({ _id: id.trim() })
            if (user) {
                const newAccess = user.access
                newAccess.push(project_id)

                const newUser = await User.findOneAndUpdate({ _id: id }, {access: [...newAccess]}, { new: true })
                if (newUser) {
                    console.log("Updated access for user", newUser)
                }
            }
        }
    }

    for (let i = 0; i < data_entry_operators.length; i++) {
        const id = data_entry_operators[i].split(" - ")[1]
        if (ObjectId.isValid(id.trim())) {
            const user = await User.findOne({ _id: id.trim() })
            if (user) {
                const newAccess = user.access
                newAccess.push(project_id)

                const newUser = await User.findOneAndUpdate({ _id: id }, {access: [...newAccess]}, { new: true })
                if (newUser) {
                    console.log("Updated access for user", newUser)
                }
            }
        }
    }

    return true
}   

module.exports = {userAccessUpdator}