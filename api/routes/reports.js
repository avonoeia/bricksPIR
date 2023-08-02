const express = require('express')
const { getReports, getLimitedReports, getReport, startNewReport, resubmitReport, approveReport } = require('../controllers/reportController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Protected route (Authentication token required)
router.use(requireAuth)

router.get('/', getReports)

router.get('/get-limited-reports', getLimitedReports)

router.get('/get-report/:report_id', getReport)

router.post('/start-new-report', startNewReport)

router.post('/resubmit/:report_id', resubmitReport)

router.patch('/approve-report/:report_id', approveReport)


module.exports = router