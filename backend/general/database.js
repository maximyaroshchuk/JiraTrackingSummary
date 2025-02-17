require('dotenv').config();
const {MongoClient} = require("mongodb");
const DATABASE_URL = process.env.DATABASE_URL;

console.log('DATABASE_URL', process.env.DATABASE_URL)

const client = new MongoClient(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 100000,
    minPoolSize: 10
});

async function getDatabaseInstance() {
    try {
        await client.connect();
        return client.db("lightconvert");
    } catch (err) {
        console.error("DATABASE001 Error connecting to MongoDB:", err);
    }
}

module.exports = {
    getDatabaseInstance,
};