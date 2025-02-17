const axios = require('axios');
const dayjs = require('dayjs');
require('dotenv').config();

const JIRA_URL = 'https://jira-splynx.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const AUTH_HEADER = {
    headers: {
        Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64')}`,
        Accept: 'application/json'
    }
};

async function getTodayWorklogs() {
    const today = dayjs().format('YYYY-MM-DD');  // Сьогоднішня дата
    const jql = `worklogAuthor = currentUser() AND worklogDate = ${today}`;  // Тільки для поточного користувача
    const searchUrl = `${JIRA_URL}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=summary`;

    const response = await axios.get(searchUrl, AUTH_HEADER);
    const issues = response.data.issues;

    const tasks = await Promise.all(
        issues.map(async (issue) => {
            const worklogUrl = `${JIRA_URL}/rest/api/3/issue/${issue.key}/worklog`;
            const worklogResponse = await axios.get(worklogUrl, AUTH_HEADER);

            // Фільтруємо тільки worklogs для поточного користувача і за сьогоднішній день
            const todayLogs = worklogResponse.data.worklogs.filter(log =>
                log.author.emailAddress === JIRA_EMAIL && log.started.startsWith(today)
            );

            // Якщо є хоча б один worklog за сьогодні для поточного користувача
            if (todayLogs.length > 0) {
                console.log(`Worklogs for ${issue.key}:`, todayLogs); // Логування worklogs для кожної задачі

                const totalTimeSpent = todayLogs.reduce((sum, log) => sum + log.timeSpentSeconds, 0);
                console.log(`Total time for ${issue.key}:`, totalTimeSpent); // Логування загального часу

                // Перетворення часу в формат "Xh Ym"
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
        return sum + (hours * 60 + minutes);  // Перетворюємо все в хвилини для підсумку
    }, 0);

    const totalHours = Math.floor(total / 60);
    const totalMinutes = total % 60;

    return {
        tasks: filteredTasks,
        total: `${totalHours}h ${totalMinutes}m`
    };
}

module.exports = {
    getTodayWorklogs
};
