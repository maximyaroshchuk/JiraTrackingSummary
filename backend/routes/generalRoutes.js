const express = require("express");
const {
    getTodayWorklogs,
    getWorklogsByDate
} = require("../controllers/worklogStatisticController");

const {
    getUserData,
    saveUserData
} = require("../controllers/userController");

const router = express.Router();

router.get('/api/worklogs', getTodayWorklogs);
router.get('/api/worklogs-by-date', getWorklogsByDate);

router.post('/customer/save-user-data', saveUserData);
router.get('/customer/get-user-data', getUserData);

module.exports = router;