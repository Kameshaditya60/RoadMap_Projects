#!/usr/bin/env node

const https = require('https');

// Get GitHub username from CLI argument
const username = process.argv[2];

if (!username) {
  console.log("❌ Please provide a GitHub username.");
  process.exit(1);
}


const url = `https://api.github.com/users/${username}/events`;



const options = {
  headers: {
    'User-Agent': 'node.js', // Must
    'Accept': 'application/vnd.github.v3+json'
  }
};


https.get(url, options, (res) => {
  let data = '';

  // Check for errors (404, 403, etc.)
  if (res.statusCode === 404) {
    console.error(`❌ User "${username}" not found.`);
    return;
  } else if (res.statusCode !== 200) {
    console.error(`❌ Failed to fetch data. Status code: ${res.statusCode}`);
    return;
  }

  // Read data chunks
  res.on('data', (chunk) => {
    data += chunk;
  });

  // Once data is received
  res.on('end', () => {
    try {
      const events = JSON.parse(data);

      console.log(`📋 Recent GitHub activity for "${username}":\n`);

      events.slice(0, 10).forEach((event) => {
        switch (event.type) {
          case 'PushEvent':
            console.log(`🚀 Pushed ${event.payload.commits.length} commit(s) to ${event.repo.name}`);
            break;
          case 'IssuesEvent':
            console.log(`🐛 ${event.payload.action} an issue in ${event.repo.name}`);
            break;
          case 'IssueCommentEvent':
            console.log(`💬 Commented on an issue in ${event.repo.name}`);
            break;
          case 'WatchEvent':
            console.log(`⭐ Starred ${event.repo.name}`);
            break;
          case 'CreateEvent':
            console.log(`📁 Created ${event.payload.ref_type} in ${event.repo.name}`);
            break;
          default:
            console.log(`📌 ${event.type} in ${event.repo.name}`);
        }
      });
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
    }
  });
}).on('error', (err) => {
  console.error('❌ Request failed:', err.message);
});