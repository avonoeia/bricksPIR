const Project = require('../models/projectModel')

function updateActivities(project, report_id, duration, r_activities) {
    for (let i = 0; i < r_activities.length; i++) {
        const act = r_activities[i]
        const targetIdx = project.activities.findIndex(item => item.activity == act.activity)
        project.activities[targetIdx].total_achieved = parseInt(project.activities[targetIdx].total_achieved) + parseInt(act.achieved)

        project.activities[targetIdx].history = [...project.activities[targetIdx].history, [ report_id, duration, act.achieved ]]
    }

    return project
}

function updateMaterials(project, report_id, duration, r_materials) {
    for (let i = 0; i < r_materials.length; i++) {
        const mat = r_materials[i]
        const targetIdx = project.materials.findIndex(item => item.material == mat.material)
        project.materials[targetIdx].history.push([ report_id, duration, -mat.usage ])
    }

    return project
}

function updateEquipments(project, report_id, duration, r_equipments) {
    for (let i = 0; i < r_equipments.length; i++) {
        const eqp = r_equipments[i]
        const targetIdx = project.equipments.findIndex(item => item.serial_no == eqp.serial_no)
        project.equipments[targetIdx].history.push([ report_id, duration, [eqp.hours, eqp.status] ])
    }

    return project
}

function updateLabour(project, report_id, duration, r_labour) {
    
    project.labour[report_id] = []
    for (let  i = 0; i < r_labour.length; i++) {
        const labour = r_labour[i]
        project.labour[report_id].push([labour.description, labour.planned, labour.actual])
    }


    return project
}

function updateVisitors(project, report_id, duration, r_visitors) {
    
    for (let i = 0; i < r_visitors.length; i++) {
        const visitor = r_visitors[i]
        project.visitors.push([ report_id, duration, [visitor.name, visitor.organization] ])
    }

    return project
}

async function projectUpdator(report) {
    const { project_id, duration, activities, equipments, materials, labour, visitors } = report

    let project = ""
    try {
        project = await Project.findOne({ _id: project_id })
    } catch (err) {
        throw Error(`Unexpected error when fetching project with id ${project_id}`)
    }

    project = updateActivities(project, report._id, duration, activities)
    project = updateMaterials(project, report._id, duration, materials)
    project = updateEquipments(project, report._id, duration, equipments)
    project = updateLabour(project, report._id, duration, labour)
    project = updateVisitors(project, report._id, duration, visitors)
    console.log("Project", project)
    return project
}

module.exports = { projectUpdator }