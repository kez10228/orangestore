const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = require("./api/routes/routes");

const app = express();
const port = 80;

// Middleware to parse JSON body
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "api/controllers/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve the uploads directory
app.use("/uploads", express.static(uploadDir));

// Register routes
routes(app);

// Catch-all 404 middleware
app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// ---- Start Server ----
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
