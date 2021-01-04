import { GameObjects, Scene } from "phaser"
import Hero from "../entities/Hero";
import Vector from "../utils/Vector";

type LevelMap = number[][];
type Position = {x: number, y: number};

enum State {
  Waiting,
  Switching,
}

export default class Level extends Scene {
  public static readonly STATE_KEY: string = "level_key";

  private map?: LevelMap;
  private position: Position;
  private nextPos?: Position;

  // Detect if pointer is down
  private pDown = false;
  private pPosTemp: undefined | { x: number, y: number };

  // Borders
  private bUp?: GameObjects.Rectangle;
  private bDown?: GameObjects.Rectangle;
  private bRight?: GameObjects.Rectangle;
  private bLeft?: GameObjects.Rectangle;

  // Gates
  private gUp?: GameObjects.Rectangle;
  private gDown?: GameObjects.Rectangle;
  private gRight?: GameObjects.Rectangle;
  private gLeft?: GameObjects.Rectangle;

  private readonly borderThickness = 20;
  private readonly borderColor = 0x000000;
  private readonly gateSize = 70;
  private readonly gateColor = 0x20ff00;

  // Hero
  private hero?: Hero;

  private state: State;

  constructor() {
    super({
      key: Level.STATE_KEY,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        }
      }
    });

    this.position = {x: 0, y: 1};

    this.state = State.Waiting;
  }

  public create(): void {
    this.add.rectangle(0, 0, this.cameras.main.width *2 , this.cameras.main.height*2, 0xffffff);
    this.map = [
      [ -1, 2, 3, -1],
      [ 0, 1, -1, -1],
      [ -1, 4, 5, 6],
    ];

    this.hero = new Hero(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
    this.add.existing(this.hero)

    console.log("[Phaser] Level created");

    // Create Borders
    this.bUp = this.add.rectangle(
      this.cameras.main.width / 2,
      this.borderThickness / 2,
      this.cameras.main.width,
      this.borderThickness,
      this.borderColor
    );
    this.bDown = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height - this.borderThickness / 2,
      this.cameras.main.width,
      this.borderThickness,
      this.borderColor
    );
    this.bLeft = this.add.rectangle(
      this.borderThickness / 2,
      this.cameras.main.height / 2,
      this.borderThickness,
      this.cameras.main.height,
      this.borderColor
    );
    this.bRight = this.add.rectangle(
      this.cameras.main.width - this.borderThickness / 2,
      this.cameras.main.height / 2,
      this.borderThickness,
      this.cameras.main.height,
      this.borderColor
    );

    // Create Gates
    this.gUp = this.add.rectangle(
      this.cameras.main.width / 2,
      this.borderThickness / 2,
      this.gateSize,
      this.borderThickness,
      this.gateColor
    )
    this.gDown = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height - this.borderThickness / 2,
      this.gateSize,
      this.borderThickness,
      this.gateColor
    )
    this.gLeft = this.add.rectangle(
      this.borderThickness / 2,
      this.cameras.main.height / 2,
      this.borderThickness,
      this.gateSize,
      this.gateColor
    )
    this.gRight = this.add.rectangle(
      this.cameras.main.width - this.borderThickness / 2,
      this.cameras.main.height / 2,
      this.borderThickness,
      this.gateSize,
      this.gateColor
    )

    this.draw();
  }

  private getMap(y: number, x: number): undefined | number {
    if(this.map == null) return undefined;
    if(this.map[y] == null) return undefined;
    return this.map[y][x];
  }

  private draw(): void {
    if(this.gUp == null ||
       this.gDown == null ||
       this.gRight == null ||
       this.gLeft == null) return;
    if(this.getMap(this.position.y - 1, this.position.x) == null ||
      this.getMap(this.position.y - 1, this.position.x) === -1) {
      this.gDown.visible = false;
    } else { this.gDown.visible = true }
    if(this.getMap(this.position.y + 1, this.position.x) == null ||
      this.getMap(this.position.y + 1, this.position.x) === -1) {
      this.gUp.visible = false;
    } else { this.gUp.visible = true }
    if(this.getMap(this.position.y, this.position.x + 1) == null ||
      this.getMap(this.position.y, this.position.x + 1) === -1) {
      this.gRight.visible = false;
    } else { this.gRight.visible = true }
    if(this.getMap(this.position.y, this.position.x - 1) == null ||
      this.getMap(this.position.y, this.position.x - 1) === -1) {
      this.gLeft.visible = false;
    } else { this.gLeft.visible = true }
  }

  private changeZone(x: -1 | 0 | 1, y: -1 | 0 | 1): void {
    const next = this.getMap(this.position.y + y, this.position.x + x);
    if(next == null || next === -1) return;

    this.state = State.Switching;
    this.nextPos = {
      x: this.position.x + x,
      y: this.position.y + y,
    }
    if(this.hero) this.hero.setObjective(new Vector(this.cameras.main.width / 2 * (x + 1), this.cameras.main.height / 2 * (-y + 1)));
    console.log(this.map == null ? "Problem" : this.map[this.position.y][this.position.x]);
  }

  public update(): void {
    if(this.state === State.Waiting) {
      if(this.input.pointer1.isDown && !this.pDown) {
        this.pDown = true;
        this.pPosTemp = {x: this.input.pointer1.x, y: this.input.pointer1.y};
      }

      if(this.pPosTemp != null && this.pDown) {
        const delta = {x: this.input.pointer1.x - this.pPosTemp.x, y: this.input.pointer1.y - this.pPosTemp.y }
        if(Math.abs(delta.x) > 150) {
          if (delta.x > 0) this.changeZone(-1, 0);
          if (delta.x < 0) this.changeZone(1, 0);
          this.pDown = false
        }
        if(Math.abs(delta.y) > 150) {
          if (delta.y > 0) this.changeZone(0, 1);
          if (delta.y < 0) this.changeZone(0, -1);
          this.pDown = false
        }
      }

      if(!this.input.pointer1.isDown) {
        this.pDown = false;
        this.pPosTemp = undefined;
      }
    } else if(this.state === State.Switching) {
      // reseting swipe state
      this.pDown = false;
      this.pPosTemp = undefined;
      if(this.hero && this.hero.isOnTarget() && this.nextPos) {
        this.hero.setX((1 - (this.nextPos.x - this.position.x)) * this.cameras.main.width / 2);
        this.hero.setY((1 + (this.nextPos.y - this.position.y)) * this.cameras.main.height / 2);

        this.position = this.nextPos;
        this.nextPos = undefined;


        this.draw();
        this.hero.setObjective(new Vector(this.cameras.main.width / 2, this.cameras.main.height / 2));

        this.state = State.Waiting;
      }
    }
    this.hero?.update();
  }
}
