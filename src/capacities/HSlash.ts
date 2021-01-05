import {GameObjects} from "phaser";
import Enemy from "../entities/Enemy";
import Hero from "../entities/Hero";
import Level, {State} from "../scenes/Level";
import Capacity from "./Capacity";

/**
* Slash capacity for the hero
**/
export default class HSlash implements Capacity<Hero> {
  /**
  * Owner of the capacity
  **/
  public owner: Hero;

  /**
  * Name of the capacity
  **/
  public name = "Slash";

  /**
  * Cooldown of the capacity
  **/
  public cooldown = 1000;

  /**
  * Current cooldown of the ability. It's ready to be used when it reach 0.
  **/
  public currentCooldown: number;

  /**
  * The damage of the ability
  **/
  public damage = 5;

  constructor(owner: Hero) {
    this.owner = owner;

    this.currentCooldown = 0;
  }

  /**
  * This is the effect the capacity has on the level
  * @param {Level} scene - The level to impact
  **/
  public effect(scene: Level): void {
    if(scene.enemies) {
      scene.enemies.children.iterate((g: GameObjects.GameObject) => {
        if(g instanceof Enemy) {
          g.takeDamage(this.damage);
        }
      });
    }
  }

  /**
  * Update of the ability. Should be called from the update method of his owner.
  * @param {number} time  - The time (in milllis) since the opening of the app
  * @param {number} delta - The time (in millis) since the last frame
  **/
  public update(_: number, delta: number): void {
    if(this.currentCooldown <= 0) {
      if (this.owner.scene instanceof Level && this.owner.scene.state === State.Fighting) {
        this.effect(this.owner.scene)
        this.currentCooldown = this.cooldown;
      }
    } else {
      this.currentCooldown -= delta;
    }
  }
}
