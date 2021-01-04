const express = require("express");
const path = require("path");
const App = express();

const hostPrefix = process.env.SWIPEGEONS_PREFIX || "";
const port = process.env.SWIPEGEONS_PORT || 3000;

App.engine("html", require("ejs").renderFile);
App.use(`${hostPrefix}/styles`, express.static(path.join(__dirname, "public", "styles")));
App.use(`${hostPrefix}/images`, express.static(path.join(__dirname, "public", "images")));
App.use(`${hostPrefix}/fonts`, express.static(path.join(__dirname, "public", "fonts")));
App.use(`${hostPrefix}/`, express.static(path.join(__dirname, "dist")));

App.get(`${hostPrefix}/`, (req, res) => {
  res.render("index.html");
});
App.get(`${hostPrefix}/swipegeons.webmanifest`, (req, res) => {
  res.sendFile(path.join(__dirname, "swipegeons.webmanifest"));
});

App.listen(port, () => {
  console.log(`Server started and listening on ${port} with prefix ${hostPrefix}`);
});
