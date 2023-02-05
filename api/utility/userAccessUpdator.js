
const User = require('../models/userModel')
const ObjectId = require('mongodb').ObjectId;

async function userAccessUpdator(roles, project_id) {
    const site_managers = roles.site_manager
    const data_entry_operators = roles.data_entry_operator

    for (let i = 0; i < site_managers.length; i++) {
        const id = site_managers[i].split(" - ")[1]
        if (ObjectId.isValid(id.trim())) {
            const user = await User.findOne({ _id: id.trim() })
            if (user) {
                console.log(user.access)
                const newAccess = user.access
                newAccess.push(project_id)
                console.log("SM", newAccess)
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
                console.log(user.access)
                const newAccess = user.access
                newAccess.push(project_id)
                console.log("DEO", newAccess)
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