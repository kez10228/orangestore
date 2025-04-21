const multer = require("multer"); // For handling file uploads
const path = require("path"); // For working with file and directory paths
const fs = require("fs"); // For file system operations
const { exec } = require("child_process"); // For executing shell commands

// Upload handler
exports.upload = (req, res) => {
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  const upload = multer({ storage });

  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).send("No file uploaded.");
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
    "git pull && npm install && sudo pm2 restart orangestore",
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error during deploy:", err);
        return;
      }
      console.log("Deployment output:", stdout);
      console.error("Deployment errors:", stderr);
    }
  );
};
