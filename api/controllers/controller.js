const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const filename = `${Date.now()}-${baseName}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("file");

// Upload handler
exports.upload = (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("File size exceeds the limit.");
        }
        return res.status(500).send("An error occurred during file upload.");
      }
      if (!req.file) {
        console.error("No file received");
        return res.status(400).send("No file uploaded.");
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      console.log(`File uploaded: ${req.file.originalname}`);
      console.log(`File saved at: ${req.file.path}`);
      console.log(`File URL: ${fileUrl}`);

      res.json({ imageUrl: fileUrl });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
};

// Serve uploaded files
exports.uploads = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, "../../uploads", filename); // Adjust path to point to the correct uploads directory

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(404).send("File not found.");
  }

  // Serve the file
  res.sendFile(filePath);
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
