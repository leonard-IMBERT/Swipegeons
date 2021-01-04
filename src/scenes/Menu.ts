import { Scene } from "phaser";

import MenuTemplate, {Actions} from  "../utils/MenuTemplate";

export default class Menu extends Scene {
  public static readonly STATE_KEY: string = "scene_menu_key";

  private _menu: MenuTemplate;
  
  private _keys: {
    up: Phaser.Input.Keyboard.Key,
    down: Phaser.Input.Keyboard.Key,
    enter: Phaser.Input.Keyboard.Key,
  };

  constructor() {
    super({
      key: Menu.STATE_KEY,
      physics:  {
        default: "arcade",
        arcade: {
          debug: true,
        }
      }
    });
  }

  public create(): void {
    this.add.rectangle(0, 0, this.cameras.main.width * 2, this.cameras.main.height * 2, 0xcc2222);
    this._menu = new MenuTemplate([
      {
        name: "Play",
        action: (act: Actions) => { if (act === Actions.Enter) {
          // start game
          // this.scene.start(...);
        }}
      }, {
        name: "Settings",
        action: (act: Actions) => { if (act === Actions.Enter) {
          // show options
          this._menu.hide();
        }}
      }
    ], this);

    this._menu.draw();
    this._keys = {
      up: this.input.keyboard.addKey("UP"),
      down: this.input.keyboard.addKey("DOWN"),
      enter: this.input.keyboard.addKey("ENTER"),
    }

    this.input.on('pointerdown', (event) => {
      this._menu.select(event.position.x, event.position.y);
    })
  }

  public update(): void {
    if (this.input.keyboard.checkDown(this._keys.up, 1000)) this._menu.keyUp();

    if (this.input.keyboard.checkDown(this._keys.down, 1000)) this._menu.keyDown();

    if (this.input.keyboard.checkDown(this._keys.enter, 1000)) this._menu.keyPressed(Actions.Enter);
  }
  
}
