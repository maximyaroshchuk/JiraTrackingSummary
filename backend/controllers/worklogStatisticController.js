const axios = require('axios');
const dayjs = require('dayjs');
require('dotenv').config();
const { getCollection } = require('../collections/generalCollectionsService');
const {ObjectId} = require("mongodb");
const {decrypt} = require("../general/cryptoController");

let usersCollection;
const getCollections = async () => {
    usersCollection = await getCollection('users');
};

getCollections().catch(console.error);

async function getTodayWorklogs(req, res) {
    try {
        const userId = req.user.userId;
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user || !user.jiraEmail || !user.jiraApiKey || !user.jiraInstanceUrl) {
            return res.status(400).json({ error: 'Please configure your JIRA settings in your profile' });
        }

        const JIRA_URL = user.jiraInstanceUrl;

        const AUTH_HEADER = {
            headers: {
                Authorization: `Basic ${Buffer.from(`${user.jiraEmail}:${decrypt(user.jiraApiKey)}`).toString('base64')}`,
                Accept: 'application/json'
            }
        };

        const today = dayjs().format('YYYY-MM-DD');
        const jql = `worklogAuthor = currentUser() AND worklogDate = ${today}`;
        const searchUrl = `${JIRA_URL}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=summary`;

        const response = await axios.get(searchUrl, AUTH_HEADER);
        const issues = response.data.issues;

        let latestWorklogEnd = null;

        const tasks = await Promise.all(
            issues.map(async (issue) => {
                const worklogUrl = `${JIRA_URL}/rest/api/3/issue/${issue.key}/worklog`;
                const worklogResponse = await axios.get(worklogUrl, AUTH_HEADER);

                const todayLogs = worklogResponse.data.worklogs.filter(log =>
                    log.author.emailAddress === user.jiraEmail && log.started.startsWith(today)
                );

                if (todayLogs.length > 0) {
                    todayLogs.forEach(log => {
                        const logStart = dayjs(log.started);
                        const logEnd = logStart.add(log.timeSpentSeconds, 'second');

                        if (!latestWorklogEnd || logEnd.isAfter(latestWorklogEnd)) {
                            latestWorklogEnd = logEnd;
                        }
                    });

                    const totalTimeSpent = todayLogs.reduce((sum, log) => sum + log.timeSpentSeconds, 0);
                    const hours = Math.floor(totalTimeSpent / 3600);
                    const minutes = Math.floor((totalTimeSpent % 3600) / 60);

                    return {
                        key: issue.key,
                        summary: issue.fields.summary,
                        timeSpent: `${hours}h ${minutes}m`
                    };
                }

                return null;
            })
        );

        const filteredTasks = tasks.filter(task => task !== null);
        const total = filteredTasks.reduce((sum, task) => {
            const [hours, minutes] = task.timeSpent.split(' ').map(t => parseInt(t));
            return sum + (hours * 60 + minutes);
        }, 0);

        const totalHours = Math.floor(total / 60);
        const totalMinutes = total % 60;

        let timeSinceLastWorklog = "0h 0m";
        if (latestWorklogEnd) {
            const now = dayjs();
            const diffMinutes = now.diff(latestWorklogEnd, 'minute');
            const diffHours = Math.floor(diffMinutes / 60);
            const remainingMinutes = diffMinutes % 60;
            timeSinceLastWorklog = `${diffHours}h ${remainingMinutes}m`;
        }

        return res.json({
            tasks: filteredTasks,
            total: `${totalHours}h ${totalMinutes}m`,
            timeSinceLastWorklog
        });
    } catch (error) {
        console.error("Error fetching worklogs:", error);
        return res.status(500).json({ error: "Server error while fetching worklogs." });
    }
}

module.exports = {
    getTodayWorklogs
};
