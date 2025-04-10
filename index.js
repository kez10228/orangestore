const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/deploy', (req, res) => {
  const branch = req.body.ref;

  if (branch === 'refs/heads/main') {
    console.log('Deploying latest code...');

    exec('git pull origin main', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).send('Failed to pull changes');
      }

      console.log(stdout);

      exec('pm2 restart orangestore', (err, stdout, stderr) => {
        if (err) {
          console.error(stderr);
          return res.status(500).send('Failed to restart server');
        }

        console.log(stdout);
        res.status(200).send('Deployment complete!');
      });
    });
  } else {
    res.status(200).send('Push detected but not on main branch, skipping deploy.');
  }
});

app.listen(port, () => {
  console.log(`Deploy server listening on port ${port}`);
});
