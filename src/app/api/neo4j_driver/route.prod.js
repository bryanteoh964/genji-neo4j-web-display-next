import { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration } from 'neo4j-driver'
const neo4j = require('neo4j-driver');

const secrets = JSON.parse( process.env.APP_SECRETS );

const DB_URI = secrets.NEO4J_URI;
const DB_USER = secrets.NEO4J_USERNAME;
const DB_PASSWORD = secrets.NEO4J_PASSWORD;

let driver = neo4j.driver(DB_URI, neo4j.auth.basic(DB_USER, DB_PASSWORD));

// Function to establish a session with the Neo4j database
async function getSession() {
    const session = driver.session();
    return session;
}

module.exports = { getSession };
