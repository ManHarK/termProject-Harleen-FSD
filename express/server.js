const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const app = express();


require('dotenv').config();
const port = process.env.PORT || 3000;



// Check and initialize database if needed
if (!fs.existsSync("./db/database.db")) {
  console.log("Database not found, running import script...");
  require("./data/import.js");
}

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, "public")));

const gardenRoutes = require("./routes/gardenRoutes");
app.use("/api/v1/gardens", gardenRoutes);

// For any other route, serve React's index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.listen(port, () => {
//   console.log(`Server is running on port http://localhost:${port}`);
// });





