const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();

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

app.listen(3000, () => console.log("Server running on port 3000"));

