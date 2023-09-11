const express = require("express");
const bcrypt = require("bcrypt");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const port = 3001;
const path = require("path");
app.use(express.json());
const dataStore = [];
const dbPath = path.join(__dirname, "data.db");

let db = null;

async function intialzeAndRunDb() {
  try {
    db = await open({ filePath: dbPath, driver: sqlite3.Database });
  } catch (error) {
    console.log(error);
  }
}
intialzeAndRunDb();

app.post("/api/data", async (req, res) => {
  let payload = req.body;
  payload = JSON.parse(payload);
  const { name, origin, destination, secret_key } = payload;
  // Validate data integrity using bcrypt
  const calculatedSecretKey = await bcrypt.compare(
    JSON.stringify({
      name: payload.name,
      origin: payload.origin,
      destination: payload.destination,
    }),
    secret_key
  ); //this method will return true if these two match otherwise it return false

  if (calculatedSecretKey === true) {
    const query = `insert into table(name,origin,destination,timestamp) 
                 values(${name},${origin},${destination},${new Date()})`;
    const dbResponse = await db.run(query);
    res.send(dbResponse);
    console.log("Data received and saved:", payload);
    res.sendStatus(200);
  } else {
    console.error("Error has happened:", payload);
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Listener service running on port ${port}`);
});

module.exports = app;
