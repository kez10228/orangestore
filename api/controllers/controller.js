const multer = require("multer"); // For handling file uploads
const path = require("path"); // For working with file and directory paths
const fs = require("fs"); // For file system operations
const { exec } = require("child_process"); // For executing shell commands

// Upload handler
exports.upload = (req, res) => {
  const upload = multer({ dest: "uploads/" }).single("file");

  upload(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).send("No file uploaded.");
    }
    if (!req.file) {
      console.error("No file received");
      return res.status(400).send("No file uploaded.");
    }
    console.log(`File uploaded: ${req.file.originalname}`);
    console.log(`File saved at: ${req.file.path}`);
    res.send(`File uploaded: ${req.file.originalname}`);
  });
};

// Test endpoint
exports.test = (req, res) => {
  console.log("Test endpoint hit.");
  return res.send("Test successful!");
};

// Deployment handler
exports.deploy = (req, res) => {
  console.log("Received GitHub webhook...");

  // Respond to GitHub immediately to prevent EOF
  res.status(200).send("Webhook received and deployment started.");

  // Perform deployment logic in the background
  exec(
    "git pull && npm install && pm2 restart orangestore",
    {
      env: {
        ...process.env,
        PATH:
          "/root/.local/state/fnm_multishells/131468_1745254813772/bin:" +
          process.env.PATH,
      },
    },
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error during deploy:", err);
        console.error("Standard Error Output:", stderr);
        return;
      }
      console.log("Deployment output:", stdout);
      console.error("Deployment errors:", stderr);
    }
  );
};
