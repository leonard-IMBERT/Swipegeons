import Enemy from "./entities/Enemy";
import Item from "./items/Item";

/**
* @typedef Room
* @property {number} seed - The seed for the room
* @property {Item[]} loot - The items looted once the room is cleared
* @property {Enemy[]} enemies - The enemies in the room
**/
export type Room = {
  seed: number;
  loot: Item[];
  enemies: Enemy[];
}

/**
* Return an empty room
**/
export function EmptyRoom(): Room {
  return {
    seed: Math.random(),
    loot: [],
    enemies: [],
  }
}


/**
* The level Map
**/
export default class Map {
  private _map: (Room | undefined)[][];

  constructor(map: (Room | undefined)[][]) {
    this._map = map;
  }

  /**
  * Set the room at (x,y)
  * @param {number} x - The x coordinate to replace
  * @param {number} y - The y coordinate to replace
  * @param {Room} room - The room to place
  * @returns {Map} this
  **/
  public set(x:number, y: number, room: Room): Map {
    if(!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
      throw new Error("[Error] Invalid values");
    }

    if(this._map[x] == null) this._map[x] = [];
    this._map[x][y] = room;

    return this;
  }

  /**
  * Remove the room at the give coordinates
  * @param {number} x - The x coordinate to remove
  * @param {number} y - The y coordinate to remove
  * @returns {Map} this
  **/
  public remove(x: number, y: number): Map {
    if(!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
      throw new Error("[Error] Invalid values");
    }
    this._map[x][y] = undefined;

    return this;
  }

  /**
  * Get the room at the give coordinates
  * @param {number} x - The x coordinate to get
  * @param {number} y - The y coordinate to get
  * @returns {Room | undefined} The room if found, undefined otherwise
  **/
  public get(x: number, y: number): Room | undefined {
    if(!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new Error("[Error] Invalid values");
    }
    if(x < 0 || y < 0) return undefined;
    if(this._map[x] == null) return undefined;
    return this._map[x][y];
  }
}
