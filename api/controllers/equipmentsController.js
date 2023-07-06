const ObjectId = require('mongodb').ObjectId;
const Report = require('../models/reportModel')
const Project = require('../models/projectModel')
const Project = require('../models/projectModel')
const Equipments = require('../models/equipmentsModel')


// Get Equipments
async function getEquipments(req, res) {
    const { position } = req.user

    let equipments = []
    if (position == "admin") {
        equipments = [...await Equipments.find()]
    } else {
        return res.status(403).send("Forbidden")
    }

    return res.status(200).json({ equipments_list: [...equipments].reverse() })
}

// Get one equipment
async function getEquipment(req, res) {
    const { position } = req.user
    const { equipment_id } = req.params

    if (!ObjectId.isValid(equipment_id.trim())) {
        return res.status(400).json({ error: "Unexpected error" })
    }

    if (position === "admin") {
        const equipment = await Equipments.findOne({_id: equipment_id})
        return res.status(200).json({ equipment_details: {...equipment} })
    }

    return res.status(403).send("Forbidden")
}

// Create new equipment
async function createEquipment(req, res) {
    const { position } = req.user
    const { category, id, status, history, current_location, transferred_on } = req.body

    if (position !== "admin") {
        return res.status(403).send("Forbidden Action. Only admins can create new equipment")
    }

    if (current_location.project_name == "unassigned") {
        const newEquipment = await Equipments.create({ ... req.body })
        return res.status(200).json({ "message": "New equipment successfully created. No Project Assigned", newEquipment})
    } else {
        let project = {}
        try {
            project = await Project.findOne({_id: current_location.project_id})
        } catch (err) {
            console.log(err)
            return res.status(400).send("Unexpected Error")
        }

        project.equipments = [...project.equipments, { id, category }]

        try {
            const updatedProject = await Project.findOneAndUpdate({ _id: current_location.project_id }, { equipments: project.equipments }, { new: true })
            const newEquipment = await Equipments.create({ ...req.body })

            return res.status(200).json({ "message": "Success!", updatedEquipments: updatedProject.equipments, newEquipment })
        } catch (err) {
            console.log(err)
            return res.status(400).send("Unexpected error.")
        }
    }

}

async function addEquipment(req, res) {
    const { newEquipment } = req.body
    const { project_id } = req.params

    let project = ""
    try {
        project = await Project.findOne({ _id: project_id })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }
    
    project.equipments = [...project.equipments, newEquipment]

    try {
        const updatedProject = await Project.findOneAndUpdate({ _id: project_id }, { equipments: project.equipments }, { new: true })

        return res.status(200).json({ "message": "Success!", updatedEquipments: updatedProject.equipments })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }
}

module.exports = { getEquipments, getEquipment, addEquipment }