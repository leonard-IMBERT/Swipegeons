import Item, {Type} from "./Item";
import HSlash from "../capacities/HSlash";
import Hero from "../entities/Hero";
import Capacity from "../capacities/Capacity";
import {Stats} from "../entities/Hero";

/**
* Most basic sword
* Should be used as a weapon template
**/
export default class IronSword implements Item {
  public equiped = false;
  public type = Type.MainWeapon;
  public name = "Iron Sword";
  public modifiers: ([Stats, number] | Capacity<Hero>)[] = [];

  public owner?: Hero;

  constructor(owner?: Hero) {
    this.owner = owner;

    if(this.owner) {
      this.modifiers = [
        new HSlash(this.owner),
      ]
    }
  }

  /**
  * Give the item to a hero
  **/
  public giveTo(owner: Hero): void {
    this.owner = owner;
    this.modifiers = [ new HSlash(this.owner) ]
  }
}
