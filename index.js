const express = require("express");
const routes = require("./api/routes/routes");

const app = express();
const port = 80;

// Middleware to parse JSON body
app.use(express.json());

routes(app);

// ---- Start Server ----
app.listen(port);
app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});
console.log(`Server running on http://localhost:${port}`);
