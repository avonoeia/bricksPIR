const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rolesSchema = new Schema({
    "site_manager": {
        type: Array,
        required: true
    },
    "data_entry_operator": {
        type: Array
    },
    "project_manager": {
        type: Array
    }
}, { _id: false })


const projectSchema = new Schema({
    "project_name": {
        type: String,
        required: true
    }, 
    "employer": {
        type: String, 
        required: true
    },
    "contractor": {
        type: String,
        required: true
    },
    "contract_start_date": {
        type: Date,
        required: true
    },
    "contract_completion_date": {
        type: Date,
        required: true
    },
    "roles": {
        type: rolesSchema,
        ref: 'Roles',
        required: true
    },
    "activities": {
        type: Array,
        required: true
    },
    "materials": {
        type: Array,
    },
    "equipments": {
        type: Array,
    },
    "visitors": {
        type: Array,
    },
    "labour": {
        type: Object,
    }
})

module.exports = mongoose.model("Project", projectSchema)