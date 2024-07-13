import { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration } from 'neo4j-driver'
const neo4j = require('neo4j-driver');

const DB_URI = process.env.NEO4J_URI;
const DB_USER = process.env.NEO4J_USERNAME;
const DB_PASSWORD = process.env.NEO4J_PASSWORD;

let driver = neo4j.driver(DB_URI, neo4j.auth.basic(DB_USER, DB_PASSWORD));

// Function to establish a session with the Neo4j database
async function getSession() {
    const session = driver.session();
    return session;
}

module.exports = { getSession };
