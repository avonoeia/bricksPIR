const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportSchema = new Schema({
    project_name: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    },
    required_approvals: {
        type: Array,
        required: true
    },
    approved_by: {
        type: Array,
        required: true
    },
    duration: {
        type: Array,
    },
    activities: {
        type: Array,
        required: true
    },
    visitors: {
        type: Array,
    },
    materials: {
        type: Array,
    },
    equipments: {
        type: Array,
    },
    labour: {
        type: Array,
    },
    constraints: {
        type: String
    },
    status: {
        type: String, 
        required: true
    },
    submission_status: {
        type: String,
    },
    created: {
        type: Array,
    }
}, {timestamps: true})

module.exports = mongoose.model('Report', reportSchema)