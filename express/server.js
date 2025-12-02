// Project/express/server.js 
const express = require("express");
const cors = require("cors");
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
const publicPath = path.join(__dirname, "public");
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log("Static files served from:", publicPath);
} else {
  console.warn("Public folder not found. Build React first.");
}

const gardenRoutes = require("./routes/gardenRoutes");
app.use("/api/v1/gardens", gardenRoutes);

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  
  // Serve React app
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <body>
          <h1>Vancouver Gardens</h1>
          <p>Server is running! React build not found.</p>
          <p>API is available at <a href="/api/v1/gardens">/api/v1/gardens</a></p>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
  console.log(`API is available at http://localhost:${port}/api/v1/gardens`);
});