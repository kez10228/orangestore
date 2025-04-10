const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// ---- Upload Setup ----
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Middleware to parse JSON body
app.use(express.json());

// ---- Deploy Route ----
app.post('/deploy', (req, res) => {
  const { ref } = req.body;

  if (ref === 'refs/heads/main') {
    console.log('Forcing deploy...');

    exec('git fetch --all && git reset --hard origin/main', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).send('Git reset failed');
      }

      exec('pm2 restart orangestore', (err2, stdout2, stderr2) => {
        if (err2) {
          console.error(stderr2);
          return res.status(500).send('App restart failed');
        }

        res.send('Deployed and restarted with hard reset');
      });
    });
  } else {
    res.send('Not main branch, skipping deploy');
  }
});


// ---- Upload Route ----
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.send(`File uploaded: ${req.file.originalname}`);
});

// ---- Start Server ----
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
