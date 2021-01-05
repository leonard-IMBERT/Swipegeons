import { GameObjects, Scene } from "phaser";
import {isCapacityHero} from "../capacities/Capacity";
import Vector from "../utils/Vector";
import Item from "../items/Item";

/**
* The differents stats of a hero
**/
export enum Stats {
  MaxLife,
  Attack,
  Defense
}

/**
* The hero of the game ! (You in some way)
**/
export default class Hero extends GameObjects.IsoTriangle {
  /**
  * The size (in px) of the hero
  **/
  private static size = 15;

  /**
  * The color of the hero
  **/
  private static heroColor = 0x000055;

  /**
  * The hero will try to move to the objective
  **/
  private objective: Vector;

  /**
  * The speed of the hero
  * TODO: Should be proportional to the screen size
  **/
  private speed = 5;

  // Stats
  /** Maximum life **/
  public maxLife = 10;

  /** Current health **/
  public health: number;

  /** Attack **/
  public attack = 10;

  /** Defense **/
  public defense = 10;

  /**
  * The hero items
  **/
  public items: Item[] = [];

  constructor(scene: Scene, x?: number, y?: number) {
    super(scene, x, y, Hero.size);
    this.fillColor = Hero.heroColor;

    this.objective = new Vector(scene.cameras.main.width/2, scene.cameras.main.height/2);

    this.health = this.maxLife;
  }

  /**
  * Return the position of the hero
  **/
  public get pos(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
  * Is the hero close to his objective ?
  **/
  public isOnTarget(): boolean {
    return this.objective.minus(this.pos).norme() <= this.speed;
  }

  /**
  * Set the hero objective
  * @param {Vector} v - The objective position
  **/
  public setObjective(v: Vector): void {
    this.objective = v;
  }

  /**
  * Make the hero take damage. Should be used over modifiying its health
  **/
  public takeDamage(damage: number): void {
    this.health -= damage;
  }

  /**
  * Update the hero. Should be call each frame when the hero is present
  * @param {number} time - Current time (in millis)
  * @param {number} delta - Time (in millis) since the last frame
  **/
  public update(time: number, delta: number): void {
    const target = this.objective.minus(this.pos);
    if(target.norme() > this.speed) {
      const speed = target.times(this.speed/target.norme());
      this.setX(this.x + speed.x);
      this.setY(this.y + speed.y);
      const normSpeed = speed.times(1/speed.norme());
      this.setRotation(Math.atan2(normSpeed.y, normSpeed.x) + Math.PI / 2)
      if(normSpeed.x != 0) { this.setRotation(Math.atan(normSpeed.y/normSpeed.x) + Math.PI / 2) }
    }

    this.items.forEach((item: Item) => {
      if(item.equiped) { item.modifiers.forEach(value => {
        if(isCapacityHero(value)) { value.update(time, delta); }
      })}
    });
  }
}
