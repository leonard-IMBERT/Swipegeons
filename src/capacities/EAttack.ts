import Enemy from "../entities/Enemy";
import Level from "../scenes/Level";
import Capacity from "./Capacity";

/**
* Default enemy attack
**/
export default class EAttack implements Capacity<Enemy> {
  /**
  * The owner of the capacity
  **/
  public owner: Enemy;

  /**
  * The name of the attack
  **/
  public name = "Enemy attack";

  /**
  * The cooldown (in millis) of the attack
  **/
  public cooldown = 2000;

  /**
  * Current cooldown of the attack. 0 is when the attack is ready to be used
  **/
  public currentCooldown = 0;

  constructor(owner: Enemy) {
    this.owner = owner;
  }

  /**
  * This is the effect the capacity has on the level
  * @param {Level} scene - The level to impact
  **/
  public effect(scene: Level): void {
    if(this.currentCooldown <= 0 && scene.hero) {
      scene.hero.takeDamage(this.owner?.attack);
    }

    this.currentCooldown = this.cooldown;
  }

  /**
  * Update of the ability. Should be called from the update method of his owner.
  * @param {number} time  - The time (in milllis) since the opening of the app
  * @param {number} delta - The time (in millis) since the last frame
  **/
  public update(_: number, delta: number): void {
    if(this.currentCooldown > 0) this.currentCooldown -= delta;
  }
}
