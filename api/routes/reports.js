const express = require("express");
const {
    getReports,
    getLimitedPreviousReports,
    getLimitedPendingReports,
    getLimitedRejectedReports,
    getReport,
    startNewReport,
    rejectReport,
    resubmitReport,
    approveReport,
} = require("../controllers/reportController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Protected route (Authentication token required)
router.use(requireAuth);

router.get("/", getReports);

router.get("/get-limited-previous-reports/:pageNumber", getLimitedPreviousReports);

router.get("/get-limited-pending-reports/", getLimitedPendingReports);

router.get("/get-limited-rejected-reports/", getLimitedRejectedReports);

router.get("/get-report/:report_id", getReport);

router.post("/start-new-report", startNewReport);

router.patch("/reject/:report_id", rejectReport);

router.post("/resubmit/:report_id", resubmitReport);

router.patch("/approve-report/:report_id", approveReport);

module.exports = router;
