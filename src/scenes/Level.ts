import {GameObjects, Input, Scene} from "phaser";
import Enemy from "../entities/Enemy";
import Hero from "../entities/Hero";
import IronSword from "../items/IronSword";
import Map, {EmptyRoom} from "../Map";
import Vector from "../utils/Vector";

type Position = {x: number, y: number};

export enum State {
  Waiting,
  Switching,
  Fighting,
}

export default class Level extends Scene {
  public static readonly STATE_KEY: string = "level_key";

  private map: Map = new Map([]);
  private position: Position;
  private nextPos?: Position;

  // Keyboard support
  private keys?: {
    up: Input.Keyboard.Key,
    down: Input.Keyboard.Key,
    left: Input.Keyboard.Key,
    right: Input.Keyboard.Key,
  }

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
  public hero?: Hero;

  // Enemies
  public enemies?: GameObjects.Group;

  public state: State;

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

    // Initial position
    this.position = {x: 0, y: 1};

    this.state = State.Waiting;
  }

  public create(): void {
    // Initializing enemies group
    this.enemies = this.add.group();

    // Draw background
    this.add.rectangle(0, 0, this.cameras.main.width *2 , this.cameras.main.height*2, 0xffffff);


    // Creating map
    const bossRoom = {
      seed: Math.random(),
      loot: [],
      enemies: [new Enemy(this, 100, 100)],
    }
    this.map = new Map([
      [ undefined,   EmptyRoom(), EmptyRoom(), undefined],
      [ EmptyRoom(), EmptyRoom(), undefined,   undefined],
      [ undefined,   EmptyRoom(), EmptyRoom(), bossRoom],
    ]);

    // Hero stuffing
    this.hero = new Hero(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
    const sword = new IronSword(this.hero);
    this.hero.items.push(sword);
    sword.equiped = true;
    this.add.existing(this.hero)
    console.log(this.hero);

    console.log("[Phaser] Level created");

    // Initialize keyboard
    this.keys = {
      up: this.input.keyboard.addKey("UP"),
      down: this.input.keyboard.addKey("DOWN"),
      right: this.input.keyboard.addKey("RIGHT"),
      left: this.input.keyboard.addKey("LEFT"),
    }

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

  /**
  * Draw the map
  **/
  private draw(): void {
    if(this.gUp == null ||
       this.gDown == null ||
       this.gRight == null ||
       this.gLeft == null) return;

    this.gDown.visible  = this.map.get(this.position.y - 1, this.position.x) != null;
    this.gUp.visible    = this.map.get(this.position.y + 1, this.position.x) != null;
    this.gRight.visible = this.map.get(this.position.y, this.position.x + 1) != null;
    this.gLeft.visible  = this.map.get(this.position.y, this.position.x - 1) != null;
  }

  private changeZone(x: -1 | 0 | 1, y: -1 | 0 | 1): void {
    // Get next room
    const next = this.map.get(this.position.y + y, this.position.x + x);
    if(next == null) return;

    this.state = State.Switching;
    this.nextPos = {
      x: this.position.x + x,
      y: this.position.y + y,
    }

    // If hero, make him move
    if(this.hero) this.hero.setObjective(new Vector(this.cameras.main.width / 2 * (x + 1), this.cameras.main.height / 2 * (-y + 1)));
  }

  public update(time: number, delta: number): void {
    // ===== Waiting phase =====
    if(this.state === State.Waiting) {
      if(this.keys) {
        if(this.keys.up.isDown) this.changeZone(0, 1);
        if(this.keys.down.isDown) this.changeZone(0, -1);
        if(this.keys.left.isDown) this.changeZone(-1, 0);
        if(this.keys.right.isDown) this.changeZone(1, 0);
      }

      // When touch
      if(this.input.pointer1.isDown && !this.pDown) {
        this.pDown = true;
        this.pPosTemp = {x: this.input.pointer1.x, y: this.input.pointer1.y};
      }

      // Dragging
      if(this.pPosTemp != null && this.pDown) {
        const delta = {x: this.input.pointer1.x - this.pPosTemp.x, y: this.input.pointer1.y - this.pPosTemp.y }
        if(Math.abs(delta.x) > 150) {
          if (delta.x < 0) this.changeZone(-1, 0);
          if (delta.x > 0) this.changeZone(1, 0);
          this.pDown = false
        }
        if(Math.abs(delta.y) > 150) {
          if (delta.y < 0) this.changeZone(0, 1);
          if (delta.y > 0) this.changeZone(0, -1);
          this.pDown = false
        }
      }

      // Reset if not touching
      if(!this.input.pointer1.isDown) {
        this.pDown = false;
        this.pPosTemp = undefined;
      }
    // ===== Switching phase =====
    } else if(this.state === State.Switching) {
      // reseting swipe state
      this.pDown = false;
      this.pPosTemp = undefined;

      // Switching room
      if(this.hero && this.hero.isOnTarget() && this.nextPos) {
        // Reset Hero
        this.hero.setX((1 - (this.nextPos.x - this.position.x)) * this.cameras.main.width / 2);
        this.hero.setY((1 + (this.nextPos.y - this.position.y)) * this.cameras.main.height / 2);

        // Move Room
        this.position = this.nextPos;
        this.nextPos = undefined;
        this.draw();

        // Move Hero to center
        this.hero.setObjective(new Vector(this.cameras.main.width / 2, this.cameras.main.height / 2));

        // Populate room
        const room = this.map.get(this.position.y, this.position.x);
        if(room) {
          this.enemies?.addMultiple(room?.enemies, true);
          room.enemies = [];
        }

        this.state = State.Fighting;
      } 
    // ===== Fighting phase =====
    } else if(this.state === State.Fighting) {
      // Loot items if no enemies
      if(this.enemies == null || this.enemies.getLength() === 0) {
        const room = this.map.get(this.position.y, this.position.x);
        if(this.hero && room) { this.hero.items = this.hero.items.concat(room.loot) }
        this.state = State.Waiting;
      }
      
      // Enemy plays
      this.enemies?.children.iterate((go: GameObjects.GameObject) => {
        if(go instanceof Enemy) { go.update(time, delta); }
      });

      // Check for death
      this.enemies?.children.each((go: GameObjects.GameObject) => {
        if(go instanceof Enemy) {
          if(go.health <= 0) { go.destroy() }
        }
      });


    // DEBUG: Building report
    let enemyHealth = "";
    this.enemies?.children.iterate((go: GameObjects.GameObject) => {
      if (go instanceof Enemy) { enemyHealth = `${enemyHealth}, ${go.health}`; }
    });

    console.log("Fighting log: ",
                "Hero health: ", this.hero?.health,
                "Enemy health: ", enemyHealth);
    // END_DEBUG
    }
    this.hero?.update(time, delta);
  }
}
