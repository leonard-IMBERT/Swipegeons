import { Game } from "phaser";

import Menu from "./scenes/Menu";

export default class Swipegeons extends Game {
  public isMobile: boolean;

  constructor(canvas: HTMLCanvasElement) {
    super({
      width: canvas.width,
      height: canvas.height,
      canvas,
      type: Phaser.WEBGL,
      render: {
        antialias: false,
      },
      title: "Swipegeons"
    });

    this.isMobile = window.innerWidth < 600 || window.innerHeight < 800;

    this.scene.add(Menu.STATE_KEY, new Menu());
    this.scene.start(Menu.STATE_KEY);
  }
}
