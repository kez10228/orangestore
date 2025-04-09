const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Initialize Express app
const app = express();
const port = 3000;

// GitHub secret for verifying webhook authenticity (configure in GitHub)
const GITHUB_SECRET = 'your_github_secret_key';

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Function to verify the GitHub webhook signature
function verifyGitHubSignature(req, res, next) {
  const signature = req.headers['x-hub-signature'];
  const payload = JSON.stringify(req.body);

  const hmac = crypto.createHmac('sha1', GITHUB_SECRET);
  const digest = `sha1=${hmac.update(payload).digest('hex')}`;

  if (signature === digest) {
    next(); // Signature valid, proceed
  } else {
    res.status(401).send('Unauthorized: Signature mismatch');
  }
}

// POST endpoint for GitHub webhook at /deploy
app.post('/deploy', verifyGitHubSignature, (req, res) => {
  console.log('Received GitHub webhook:', req.body);

  // Check if the push is to the main branch
  if (req.body.ref === 'refs/heads/main') {
    console.log('Push detected to the main branch!');
    // Add your deployment logic here (e.g., pulling new changes, restarting services)
    res.status(200).send('Deployment triggered');
  } else {
    console.log('Push detected to a non-main branch');
    res.status(200).send('No deployment action needed');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
