const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.upload = (req, res) => {
  // Setup upload directory
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Setup multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  const upload = multer({ storage });

  // Handle file upload
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).send("No file uploaded.");
    res.send(`File uploaded: ${req.file.originalname}`);
  });
};

exports.test = (req, res) => {
  console.log("Test endpoint hit.");
  return res.send("Test successful!");
};

exports.deploy = (req, res) => {
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
};
