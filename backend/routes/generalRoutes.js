const express = require("express");
const {
    getTodayWorklogs
} = require("../controllers/worklogStatisticController");

const {
    getUserData,
    saveUserData
} = require("../controllers/userController");

const router = express.Router();

router.get('/api/worklogs', getTodayWorklogs);

router.post('/customer/save-user-data', saveUserData);
router.get('/customer/get-user-data', getUserData);

module.exports = router;