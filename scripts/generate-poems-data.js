#!/usr/bin/env node

/**
 * Generate static poems data from API
 * 
 * Usage: npm run generate-poems
 * 
 * This script fetches all poems data from the running development server
 * and saves it as a static JSON file that can be used instead of API calls.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const PORTS_TO_TRY = [3000, 3001, 3002];
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'poems', 'generated_poems_data.json');

function tryFetchFromPort(port) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${port}/api/poems/poem_search?q=${encodeURIComponent('=#=')}`;
    console.log(`� Trying port ${port}...`);
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          
          const jsonData = JSON.parse(data);
          console.log(`✅ Successfully connected to port ${port}`);
          console.log(`📊 Fetched ${jsonData.searchResults?.length || 0} poems`);
          resolve({ port, data: jsonData });
        } catch (error) {
          reject(new Error(`Parse error: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Connection failed: ${error.message}`));
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function fetchPoemsData() {
  console.log('🚀 Searching for running development server...');
  
  for (const port of PORTS_TO_TRY) {
    try {
      const result = await tryFetchFromPort(port);
      return result.data;
    } catch (error) {
      console.log(`❌ Port ${port}: ${error.message}`);
    }
  }
  
  throw new Error('Could not connect to development server on any port');
}

async function savePoemsData(data) {
  try {
    // Ensure the poems directory exists
    const poemsDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(poemsDir)) {
      fs.mkdirSync(poemsDir, { recursive: true });
      console.log(`📁 Created directory: ${poemsDir}`);
    }
    
    // Write the file (just the searchResults array)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data.searchResults, null, 2));
    console.log(`💾 Data saved to: ${OUTPUT_FILE}`);
    console.log(`📊 Total poems: ${data.searchResults?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error saving poems data:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎯 Starting poems data generation...\n');
    
    // Check if server is likely running by attempting to fetch
    const data = await fetchPoemsData();
    
    if (!data.searchResults || !Array.isArray(data.searchResults)) {
      throw new Error('Invalid data format received from API');
    }
    
    await savePoemsData(data);
    
    console.log('\n🎉 Success! Poems data has been generated.');
    console.log('You can now use this file instead of making API calls.');
    
  } catch (error) {
    console.error('\n💥 Script failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your development server is running: npm run dev');
    console.log('2. Ensure the API endpoint is accessible at http://localhost:3000');
    console.log('3. Check that your Neo4j database is connected and working');
    process.exit(1);
  }
}

// Run the script
main();
