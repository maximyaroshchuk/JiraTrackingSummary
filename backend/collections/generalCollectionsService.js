const {getDatabaseInstance} = require("../general/database");

const collectionsCache = {};

async function getCollection(collectionName) {
    console.log(typeof collectionName, collectionName);
    const stringifyCollectionName = String(collectionName);

    if (!collectionsCache[stringifyCollectionName]) {
        try {
            const db = await getDatabaseInstance();
            collectionsCache[stringifyCollectionName] = db.collection(stringifyCollectionName);
        } catch (err) {
            console.error("GENERALCOLLECTIONS0004 Error connecting to MongoDB:", err);
        }
    }

    return collectionsCache[stringifyCollectionName];
}

module.exports = {
    getCollection
};