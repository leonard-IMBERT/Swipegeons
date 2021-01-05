import Enemy from "../entities/Enemy";
import Hero from "../entities/Hero";
import Level from "../scenes/Level";

type Something = Enemy | Hero;

/**
* Is the argument a Hero capacity ?
**/
export function isCapacityHero(arg: unknown): arg is Capacity<Hero> {
  return typeof arg === "object" && arg != null && "effect" in arg && "name" in arg &&
    "cooldown" in arg && "owner" in arg && "update" in arg && (arg as Capacity<Something>).owner instanceof Hero;
}

/**
* Is the argument a Enemy capacity ?
**/
export function isCapacityEnemy(arg: unknown): arg is Capacity<Enemy> {
  return typeof arg === "object" && arg != null && "effect" in arg && "name" in arg &&
    "cooldown" in arg && "owner" in arg && "update" in arg && (arg as Capacity<Something>).owner instanceof Enemy;
}

/**
* A capacity
**/
export default interface Capacity<T extends Something> {
  /**
  * The owner of the capacity
  **/
  owner: T;

  /**
  * The capacity name
  **/
  name: string;
  
  /**
  * The cooldown of the capacity
  **/
  cooldown: number;

  /**
  * The currentCooldown of the capacity. 0 when the capacity is ready
  **/
  currentCooldown: number;

  /**
  * The effect of the capacity
  **/
  effect: (scene: Level) => void;

  /**
  * Update the capacity. Should be called each frame
  * @param {number} time - Current time (in millis)
  * @param {number} delta - Time (in millis) since the last frame
  **/
  update: (time:number, delta:number) => void;
}
