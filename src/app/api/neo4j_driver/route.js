export const driver = neo4j.driver(
  process.env.REACT_APP_NEO4J_URI,
  neo4j.auth.basic(process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD)
);