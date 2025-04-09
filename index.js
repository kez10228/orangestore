const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Webhook listener for GitHub events
app.post('/deploy', (req, res) => {
  const payload = req.body;
  if (payload.ref === 'refs/heads/main') {
    console.log('Push received on main branch, deploying...');
    exec('git pull origin main', { cwd: '/path/to/your/project' }, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return res.status(500).send('Error pulling latest code');
      }
      console.log(stdout);
      res.status(200).send('Deployment started');
    });
  } else {
    console.log('Push not on main branch, ignoring.');
    res.status(200).send('Not main branch, skipping deployment');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
