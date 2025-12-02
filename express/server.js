// Project/express/server.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const app = express();

// Use PORT from environment variable
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Check and initialize database if needed
const dbPath = path.join(__dirname, "db/database.db");
if (!fs.existsSync(dbPath)) {
  console.log("Database not found, running import script...");
  require("./data/import.js");
}

// Serve static files from React build
app.use(express.static(path.join(__dirname, "public")));

const gardenRoutes = require("./routes/gardenRoutes");
app.use("/api/v1/gardens", gardenRoutes);  


app.get("/*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  // Serve React for all other routes
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});