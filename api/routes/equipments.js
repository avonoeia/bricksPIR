const express = require('express')
const { getEquipments, getEquipment, createEquipment, transferEquipment }= require('../controllers/equipemtsController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Protected Route - Authentication token required
router.use(requireAuth)

// Get equipments
router.get('/', getEquipments)

// Get a specific equipment
router.get('/details/:equipment_id', getEquipment)

// Create a new equipment
router.post('/create-equipment', createEquipment)

// Transfer equipment
router.patch('/transfer-equipment/:equipment_id', transferEquipment)


module.exports = router