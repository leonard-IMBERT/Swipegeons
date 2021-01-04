const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const App = express();

const port = process.env.SWIPEGEONS_PORT || 3000;

const privateKey = fs.readFileSync("localhost.key");
const cert = fs.readFileSync("localhost.crt");

App.engine("html", require("ejs").renderFile);
App.use("/styles", express.static(path.join(__dirname, "public", "styles")));
App.use("/", express.static(path.join(__dirname, "dist")));

App.get("/", (req, res) => {
  res.render("index.html");
});
App.get("/swipegeons.webmanifest", (req, res) => {
  res.sendFile(path.join(__dirname, "swipegeons.webmanifest"));
});

https.createServer({
  key: privateKey,
  cert: cert,
}, App).listen(port, () => {
  console.log(`Server started and listening on ${port}`);
});
