const express = require('express')
// const { createProject, createWorkFieldInProject, updateWorkFieldTarget } = require('../controllers/projectController')
const { getProjects, getOneProject, createProject, addActivity, addMaterial, addStock, addEquipment, grantAccess, getProjectNameAndId } = require('../controllers/projectController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Protected Route - Authentication token required
router.use(requireAuth)

// Get projects
router.get('/', getProjects)

router.get('/get-projects-name-and-id', getProjectNameAndId)

// Get a specific project
router.get('/details/:project_id', getOneProject)

// Create a new project
router.post('/create-project', createProject)

// Create work field 
router.patch('/add-activity/:project_id', addActivity)

// Add a new material to a project
router.patch('/add-material/:project_id', addMaterial)

// Add a new equipment to a project
router.patch('/add-equipment/:project_id', addEquipment)

// Add stock for a material
router.patch('/add-stock/:project_id', addStock)

// Grant Access
router.patch('/grant-access', grantAccess)

// Update total target of a field
// router.patch('/update-total_target/:project_id', updateWorkFieldTarget)

module.exports = router