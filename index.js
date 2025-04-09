const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const { exec } = require('child_process');  // For running commands like `git pull`

const app = express();
const port = 3000;  // This can be any port your server should listen on

// Middleware to parse JSON payload
app.use(bodyParser.json());

app.use(cors());

// Save files to 'uploads/' folder
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  // In production, you'd return a public URL here
  const fileURL = `https://your-domain.com/uploads/${file.filename}`;
  res.json({ fileURL });
});

// Add your webhook listener code to a different endpoint
app.post('/deploy', (req, res) => {
  const payload = req.body;

  // Only deploy on push to the main branch (you can adjust this as needed)
  if (payload.ref === 'refs/heads/main') {
    console.log('Push received on main branch, deploying...');

    // Run a shell command to pull the latest code from the repo
    exec('git pull origin main', { cwd: '/home/ubuntu/orangestore' }, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return res.status(500).send('Error pulling latest code');
      }

      console.log(stdout);
      return res.status(200).send('Deployment started');
    });
  } else {
    console.log('Push not on main branch, ignoring.');
    return res.status(200).send('Not main branch, skipping deployment');
  }
});

// Start the main server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
