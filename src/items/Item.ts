import Hero, {Stats} from "../entities/Hero";
import Capacity from "../capacities/Capacity";

/**
* Item type
**/
export enum Type {
  MainWeapon,
  SecondaryWeapon,
  Trinket,
}

/**
* Item interface. All items (for hero) must implement it
**/
export default interface Item {

  /**
  * The owner of the item
  **/
  owner?: Hero;

  /**
  * Is the item equiped
  **/
  equiped: boolean;

  /**
  * Item type
  **/
  type: Type;

  /**
  * Item name
  **/
  name: string;

  /**
  * The modifiers the item give
  **/
  modifiers: ([Stats, number] | Capacity<Hero>)[];
}
