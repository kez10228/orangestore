const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = 3000;

// ---- Upload Setup ----
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Middleware to parse JSON body
app.use(express.json());

// ---- Deploy Route ----
app.post("/deploy", (req, res) => {
  console.log("Received GitHub webhook...");

  // Respond to GitHub immediately to prevent EOF
  res.status(200).send("Webhook received and deployment started.");

  // Perform deployment logic in the background
  exec(
    "git pull && npm install && pm2 restart orangestore",
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error during deploy:", err);
        return;
      }
      console.log("Deployment output:", stdout);
      console.error("Deployment errors:", stderr);
    }
  );
});

app.post("/test", (req, res) => {
  return res.send("Test successful!");
});

// ---- Upload Route ----
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  res.send(`File uploaded: ${req.file.originalname}`);
});

// ---- Start Server ----
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
