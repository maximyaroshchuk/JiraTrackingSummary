const express = require("express");
const {
    getTodayWorklogs
} = require("../controllers/worklogStatisticController");

const router = express.Router();

router.get('/api/worklogs', async (req, res) => {
    try {
        const result = await getTodayWorklogs();
        res.json(result);
    } catch (error) {
        console.error('Error when getting worklog:', error.message);
        res.status(500).json({ error: 'Error when getting worklog from Jira' });
    }
});

module.exports = router;