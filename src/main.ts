import Swipegeons from "./Swipegeons";
// Querying the canvas
const GAME = document.querySelector("canvas#game");
const hostPrefix = "/swipe";

if(GAME == null || !(GAME instanceof HTMLCanvasElement)) {
  throw new Error("Game canvas not found");
}

// Resizing the canvas
const height = document.body.clientHeight;
const width = document.body.clientWidth;

// const side = Math.min(height, width);
GAME.height = height;
GAME.width = width;

// Initalizing game
const game = new Swipegeons(GAME);

if("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${hostPrefix}/sw.js`);
}
