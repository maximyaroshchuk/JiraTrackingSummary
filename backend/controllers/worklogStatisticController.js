const axios = require('axios');
const dayjs = require('dayjs');
require('dotenv').config();
const { getCollection } = require('../collections/generalCollectionsService');
const { ObjectId } = require('mongodb');
const { decrypt } = require('../general/cryptoController');

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

        const tasks = await Promise.all(
            issues.map(async (issue) => {
                const worklogUrl = `${JIRA_URL}/rest/api/3/issue/${issue.key}/worklog`;
                const changelogUrl = `${JIRA_URL}/rest/api/3/issue/${issue.key}/changelog`;

                const [worklogResponse, changelogResponse] = await Promise.all([
                    axios.get(worklogUrl, AUTH_HEADER),
                    axios.get(changelogUrl, AUTH_HEADER)
                ]);

                const todayLogs = worklogResponse.data.worklogs.filter(log =>
                    log.author.emailAddress === user.jiraEmail && log.started.startsWith(today)
                );

                let latestWorklogCreated = null;
                if (todayLogs.length > 0) {
                    latestWorklogCreated = dayjs(todayLogs[todayLogs.length - 1].created);
                }

                const todayChangelogs = changelogResponse.data.values.filter(change => {
                    const createdAt = dayjs(change.created);
                    const isCommit = change.items.some(item => item.field === 'commit');
                    return createdAt.isSame(today, 'day') && isCommit;
                });

                let latestChangelogCreated = null;
                if (todayChangelogs.length > 0) {
                    latestChangelogCreated = dayjs(todayChangelogs[todayChangelogs.length - 1].created);
                }

                let latestEventCreated = latestWorklogCreated;
                if (latestChangelogCreated && (!latestWorklogCreated || latestChangelogCreated.isAfter(latestWorklogCreated))) {
                    latestEventCreated = latestChangelogCreated;
                }

                let timeSinceLastCommit = "0h 0m";
                if (latestEventCreated) {
                    const diffMinutes = dayjs().diff(latestEventCreated, 'minute');
                    const diffHours = Math.floor(diffMinutes / 60);
                    const remainingMinutes = diffMinutes % 60;
                    timeSinceLastCommit = `${diffHours}h ${remainingMinutes}m`;
                }

                const totalTimeSpent = todayLogs.reduce((sum, log) => sum + log.timeSpentSeconds, 0);
                const hours = Math.floor(totalTimeSpent / 3600);
                const minutes = Math.floor((totalTimeSpent % 3600) / 60);

                return {
                    key: issue.key,
                    summary: issue.fields.summary,
                    timeSpent: `${hours}h ${minutes}m`,
                    lastCommit: timeSinceLastCommit
                };
            })
        );

        const filteredTasks = tasks.filter(task => task !== null);
        const total = filteredTasks.reduce((sum, task) => {
            const [hours, minutes] = task.timeSpent.split(' ').map(t => parseInt(t));
            return sum + (hours * 60 + minutes);
        }, 0);

        const totalHours = Math.floor(total / 60);
        const totalMinutes = total % 60;

        return res.json({
            tasks: filteredTasks,
            total: `${totalHours}h ${totalMinutes}m 🪨`,
        });
    } catch (error) {
        console.error("Error fetching worklogs:", error);
        return res.status(500).json({ error: "Server error while fetching worklogs." });
    }
}

async function getWorklogsByDate(req, res) {
    try {
        const userId = req.user.userId;
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user || !user.jiraEmail || !user.jiraApiKey || !user.jiraInstanceUrl) {
            return res.status(400).json({ error: 'Please configure your JIRA settings in your profile' });
        }

        const requestedDate = req.query.date;
        if (!requestedDate || !dayjs(requestedDate, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ error: 'Invalid or missing date format. Use YYYY-MM-DD.' });
        }

        const JIRA_URL = user.jiraInstanceUrl;
        const AUTH_HEADER = {
            headers: {
                Authorization: `Basic ${Buffer.from(`${user.jiraEmail}:${decrypt(user.jiraApiKey)}`).toString('base64')}`,
                Accept: 'application/json'
            }
        };

        const jql = `worklogAuthor = currentUser() AND worklogDate = "${requestedDate}"`;
        const searchJqlUrl = `${JIRA_URL}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&fields=summary&expand=changelog`;

        const response = await axios.get(searchJqlUrl, AUTH_HEADER);
        const issues = response.data.issues;

        const tasks = await Promise.all(
            issues.map(async (issue) => {
                const worklogUrl = `${JIRA_URL}/rest/api/3/issue/${issue.key}/worklog`;

                const worklogResponse = await axios.get(worklogUrl, AUTH_HEADER);

                const dateStart = dayjs(requestedDate).format('YYYY-MM-DD');

                const logsForDate = worklogResponse.data.worklogs.filter(log =>
                    log.author.emailAddress === user.jiraEmail &&
                    log.started.startsWith(dateStart)
                );

                let latestWorklogCreated = logsForDate.length
                    ? dayjs(logsForDate[logsForDate.length - 1].created)
                    : null;

                const histories = issue.changelog?.histories || [];
                const changelogsForDate = histories.filter(change => {
                    const createdAt = dayjs(change.created);
                    const isCommit = change.items.some(item => item.field === 'commit');
                    return createdAt.isSame(requestedDate, 'day') && isCommit;
                });

                let latestChangelogCreated = changelogsForDate.length
                    ? dayjs(changelogsForDate[changelogsForDate.length - 1].created)
                    : null;

                let latestEventCreated = latestWorklogCreated;
                if (latestChangelogCreated && (!latestWorklogCreated || latestChangelogCreated.isAfter(latestWorklogCreated))) {
                    latestEventCreated = latestChangelogCreated;
                }

                let timeSinceLastCommit = '0h 0m';
                if (latestEventCreated) {
                    const diffMinutes = dayjs().diff(latestEventCreated, 'minute');
                    const diffHours = Math.floor(diffMinutes / 60);
                    const remainingMinutes = diffMinutes % 60;
                    timeSinceLastCommit = `${diffHours}h ${remainingMinutes}m`;
                }

                const totalTimeSpent = logsForDate.reduce((sum, log) => sum + log.timeSpentSeconds, 0);
                const hours = Math.floor(totalTimeSpent / 3600);
                const minutes = Math.floor((totalTimeSpent % 3600) / 60);

                return {
                    key: issue.key,
                    summary: issue.fields.summary,
                    timeSpent: `${hours}h ${minutes}m`,
                    lastCommit: timeSinceLastCommit,
                };
            })
        );

        const filteredTasks = tasks.filter(task => task !== null);
        const totalMinutesAll = filteredTasks.reduce((sum, task) => {
            const [h, m] = task.timeSpent.split(' ').map(t => parseInt(t));
            return sum + (h * 60 + m);
        }, 0);

        const totalHours = Math.floor(totalMinutesAll / 60);
        const totalMinutes = totalMinutesAll % 60;

        let emoji = '🪨';
        if (totalHours >= 7) {
            emoji = '🪨';
        } else if (totalHours >= 5) {
            emoji = '💪';
        } else if (totalHours >= 3) {
            emoji = '😎';
        } else if (totalHours >= 1) {
            emoji = '🐢';
        } else {
            emoji = '💤';
        }

        const formattedDate = dayjs(requestedDate).format('D MMMM YYYY');

        return res.json({
            tasks: filteredTasks,
            total: `${totalHours}h ${totalMinutes}m ‎ ${emoji}`,
            date: formattedDate,
        });
    } catch (error) {
        console.error("Error fetching worklogs:", error.response?.data || error.message);
        return res.status(500).json({ error: "Server error while fetching worklogs." });
    }
}

module.exports = {
    getTodayWorklogs,
    getWorklogsByDate
};
