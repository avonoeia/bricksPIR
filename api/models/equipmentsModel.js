const mongoose = require('mongoose')
const Schema = mongoose.Schema


const projectSchema = new Schema({
    "category": {
        type: String,
        required: true
    }, 
    "id": {
        type: String,
        required: true
    },
    "description": {
        type: String
    },
    "status": {
        type: String,
    },
    "history": {
        type: Array,
    },
    "current_location": {
        type: Object,
    },
    "transferred_on": {
        type: Date
    }
})

module.exports = mongoose.model("Equipments", projectSchema)