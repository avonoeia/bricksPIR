const ObjectId = require('mongodb').ObjectId;
const Project = require('../models/projectModel')
const User = require('../models/userModel')
const { userAccessUpdator } = require("../utility/userAccessUpdator")

async function getProjects(req, res) {
    const { position, access } = req.user
    
    let projects = []
    if (position == "admin") {
        projects = [...await Project.find()]
    } else {
        for (let i = 0; i < access.length; i++) {
            const project = await Project.findOne({ _id: access[i] })
            if (project) {
                projects.push(project)
            }
        }
    }

    return res.status(200).json({ projects_list: [...projects].reverse() })
}

async function getLimitedProjectsData(req, res) {
    const { position, access } = req.user

    const projection = 'project_name _id contractor employer contract_start_date contract_completion_date'
    
    let projects = []
    if (position == "admin") {
        projects = [...await Project.find({}, projection)]
    } else {
        for (let i = 0; i < access.length; i++) {
            const project = await Project.findOne({ _id: access[i] }, projection)
            if (project) {
                projects.push(project)
            }
        }
    }

    return res.status(200).json({ projects_list: [...projects].reverse() })
}

// Get a specific project
async function getOneProject(req, res) {
    const { position, access } = req.user
    const { project_id } = req.params

    if (!ObjectId.isValid(project_id.trim())) {
        return res.status(400).json({ error: "Unexpected error" })
    }

    let project = {}
    if (position == "admin") {
        project = await Project.findOne({ _id: project_id.trim() })
    } else {
        if (access.find(element => element == project_id)) {
            try {
                project = await Project.findOne({ _id: project_id.trim() })
            } catch(err) {
                return res.status(400).json({ error: "Unexpected error"})
            }
        } else {
            return res.status(401).json({ error: "You do not have access to this project" })
        }
    }

    if (project) {
        return res.status(200).json({ project_details: project })
    } else {
        return res.status(400).json({ error: "Unexpected error"})
    }
    
}

// Create a new project
async function createProject(req, res) {
    const { position } = req.user

    if (position != "admin") {
        return res.status(401).json({ error: "Admin privileges are required to create a new project. Please contact HQ." })
    } 

    

    try {
        const newProject = await Project.create({
            project_name: req.body.name_of_work,
            employer: req.body.employer,
            contractor: req.body.contractor,
            contract_start_date: req.body.contract_start_date,
            contract_completion_date: req.body.contract_end_date,
            roles: {
                site_manager: req.body.site_manager,
                data_entry_operator: req.body.data_entry_operator,
                project_manager: req.body.project_manager,
            },
            activities: req.body.activities,
            materials: [],
            equipments: [],
            visitors: [],
            labour: []
        })
        if (newProject) {
            console.log("New project created with id:", newProject)

            const updator = await userAccessUpdator(newProject.roles, newProject._id.toString())

            return res.status(200).json({ newProject })
        } else {
            return res.status(400).json({ error: "Unexpected error" })
        }
    } catch (err) {
        console.log(err)
    }
}

// Add activity to a project
async function addActivity(req, res) {
    const { position } = req.user
    const { newActivity } = req.body
    const { project_id } = req.params

    if (position != "admin") {
        return res.status(401).json({ error: "Admin privileges are required to add activities to a new project. Please contact HQ." })
    }
    
    let project = ""
    try {
        project = await Project.findOne({ _id: project_id })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }
    
    project.activities = [...project.activities, newActivity]

    try {
        const updatedProject = await Project.findOneAndUpdate({ _id: project_id }, { activities: project.activities }, { new: true })

        return res.status(200).json({ "message": "Success!" })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }
    
}

// Add material for a project
async function addMaterial(req, res) {
    const { newMaterial } = req.body
    const { project_id } = req.params
    
    let project = ""
    try {
        project = await Project.findOne({ _id: project_id })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }
    
    project.materials = [...project.materials, newMaterial]

    try {
        const updatedProject = await Project.findOneAndUpdate({ _id: project_id }, { materials: project.materials }, { new: true })

        return res.status(200).json({ "message": "Success!" })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }
    
}

async function addStock(req, res) {
    const { addStock } = req.body
    const { project_id } = req.params

    let project = ""
    try {
        project = await Project.findOne({ _id: project_id })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
    }

    
    let targetIdx = project.materials.findIndex(i => i.material == addStock.material)
    
    project.materials[targetIdx].stock.push([ addStock.supplier, new Date, addStock.amount ])


    try {
        const updatedProject = await Project.findOneAndUpdate({ _id: project_id }, { materials: project.materials }, { new: true })

        return res.status(200).json({ "message": "Success!", updatedMaterials: updatedProject.materials })
    } catch (err) {
        console.log(err)
        return res.status(400).send("Unexpected error.")
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

async function grantAccess(req, res) {
    const { position } = req.user
    const { user_id, project_id } = req.body

    if (position != "admin") {
        return res.status(401).json({ error: "Admin privileges are required to grant access to projects. Please contact HQ." })
    }

    const user = await User.findOne({ _id: user_id })
    const project = await Project.findOne({ _id: project_id })

    let updatedRoles = project.roles
    updatedRoles[user.position].push(user_id)

    try {
        const updatedUser = await User.findOneAndUpdate({ _id: user_id }, { access: [...user.access, project_id] }, { new: true })
        const updatedProject = await Project.findOneAndUpdate({ _id: project_id }, { roles: updatedRoles }, { new: true })

        res.status(200).json({ message: `User ${user.name} granted access to project ${project.project_name} as ${user.position}.` })
    } catch (err) {
        console.log(err)
    }
}

async function getProjectNameAndId(req, res) {
    const { position, access } = req.user

    console.log("Hit registered at getProjectsNameAndIdController")
    
    let projects = []
    if (position == "admin") {
        projects = [...await Project.find()]
    } else {
        for (let i = 0; i < access.length; i++) {
            const project = await Project.findOne({ _id: access[i] })
            if (project) {
                projects.push({
                    project_name: project.project_name,
                    _id: project._id,
                    contractor: project.contractor,
                    employer: project.employer,
                    contract_start_date: project.contract_start_date,
                    contract_completion_date: project.contract_completion_date
                })
            }
        }
    }

    return res.status(200).json({ projects_list: [...projects].reverse() })
}

module.exports = { getProjects, getLimitedProjectsData, getOneProject, createProject, addActivity, addMaterial, addStock, addEquipment, grantAccess, getProjectNameAndId }