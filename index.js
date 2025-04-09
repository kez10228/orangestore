const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

app.post('/deploy', (req, res) => {
  const { ref } = req.body;

  // Only deploy if the branch is `main`
  if (ref === 'refs/heads/main') {
    console.log('Deployment detected for main branch!');
    
    // Pull the latest changes from GitHub
    exec('git pull origin main', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error pulling the latest changes: ${stderr}`);
        return res.status(500).send('Failed to pull the latest changes.');
      }

      console.log('Successfully pulled the latest changes');
      console.log(stdout);

      // Restart your app (optional)
      exec('pm2 restart app-name', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error restarting the app: ${stderr}`);
          return res.status(500).send('Failed to restart the app.');
        }

        console.log('App successfully restarted');
        return res.status(200).send('Deployment complete');
      });
    });
  } else {
    res.status(200).send('No action taken. Not the main branch.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
