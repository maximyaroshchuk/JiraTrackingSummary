const {getCollection} = require("../collections/generalCollectionsService");
const {ObjectId} = require("mongodb");
const {get} = require("axios");
const {encrypt, decrypt} = require("../general/cryptoController");

let usersCollection
const getCollections = async () => {
    usersCollection = await getCollection('users')
}

getCollections().catch(console.error);
async function createUser(data) {
    const user = await usersCollection.insertOne({
        fullname: data.fullname,
        email: data.email,
        jiraEmail: null,
        jiraApiKey: null,
        jiraInstanceUrl: null,
        password: data.hashedPassword,
    });

    return user.insertedId;
}

async function isValidJiraConfig(jiraEmail, jiraApiKey, jiraInstanceUrl) {
    try {
        const response = await get(`${jiraInstanceUrl}/rest/api/3/myself`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraApiKey}`).toString('base64')}`,
                Accept: 'application/json'
            }
        });

        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function saveUserData(req, res) {
    const userId = req.user.userId;
    const targetUserId = req.query.id || userId;

    try {
        const { fullname, email, jiraEmail, jiraApiKey, jiraInstanceUrl } = req.body;
        const updateFields = {};

        if (fullname && fullname.length <= 0) {
            return res.status(400).json({message: 'Fullname cannot be empty'});
        }
        if (fullname) updateFields.fullname = fullname;

        if (email) updateFields.email = email;
        if (jiraEmail) updateFields.jiraEmail = jiraEmail;
        if (jiraInstanceUrl) updateFields.jiraInstanceUrl = jiraInstanceUrl;

        const isValid = await isValidJiraConfig(jiraEmail, jiraApiKey, jiraInstanceUrl);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid Jira configuration. Please check your credentials." });
        }
        updateFields.jiraApiKey = encrypt(jiraApiKey);

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid updates found" });
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(targetUserId) },
            { $set: updateFields }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: "User data saved" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("USER0001 Error updating user data:", error);
        res.status(500).json({ message: "USER0001 Internal server error" });
    }
}

async function getUserData(req, res) {
    const requestingUserId = req.user.userId;
    const targetUserId = req.query.id || requestingUserId;

    try {
        const userData = await usersCollection.aggregate([
            { $match: { _id: new ObjectId(targetUserId) } },
            { $project: { password: 0 } }
        ]).toArray();

        const user = userData[0];
        if (user) {
            if (user.jiraApiKey) {
                try {
                    user.jiraApiKey = decrypt(user.jiraApiKey);
                } catch (decryptError) {
                    console.error("USER0003 Error decrypting jiraApiKey:", decryptError);
                    user.jiraApiKey = null;
                }
            }
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("USER0002 Error retrieving user data:", error);
        res.status(500).json({ message: "USER0002 Internal server error" });
    }
}
module.exports = {
    createUser,
    saveUserData,
    getUserData,
};