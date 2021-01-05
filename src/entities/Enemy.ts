import {GameObjects, Scene} from "phaser";
import EAttack from "../capacities/EAttack";
import Level from "../scenes/Level";

/**
* Basic class for Enemies
* Should be extended by all enemies
**/
export default class Enemy extends GameObjects.Ellipse {
  /**
  * The on-screen size (in px) of the enemy
  **/
  public static size = 10;

  /**
  * The color of the enemy
  **/
  public static color = 0x00FFFF;

  // Stats
  /**
  * The current health of the enemy
  **/
  public health = 40;

  /**
  * The attack of the enemy
  **/
  public attack = 1;

  /**
  * The attack the enemy use
  **/
  public attackAbility: EAttack;

  constructor(scene: Scene, x: number, y: number, size: number = Enemy.size, color: number = Enemy.color) {
    super(scene, x, y, size, size, color);

    this.attackAbility = new EAttack(this);
  }

  /**
  * Take damage. This is where damage reduction is computed.
  * This should be used over manipulating directly the health.
  * @param {number} damage - The number of damage to take.
  * */
  public takeDamage(damage: number): void {
    this.health -= damage;
  }

  /**
  * Update the enemy. This must be call in each Scene.update where the enemy is alive.
  * @param {number} time  - The time (in milllis) since the opening of the app
  * @param {number} delta - The time (in millis) since the last frame
  **/
  public update(time: number, delta: number): void {
    if(this.health > 0) {
      if(this.attackAbility.currentCooldown <= 0 && this.scene instanceof Level) this.attackAbility.effect(this.scene);
      this.attackAbility.update(time, delta)
    }
  }
}
