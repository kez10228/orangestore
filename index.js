const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// POST endpoint for GitHub webhook at /deploy
app.post('/deploy', (req, res) => {
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
