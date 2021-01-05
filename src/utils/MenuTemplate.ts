import { GameObjects, Scene } from "phaser";
import Swipegeons from "../Swipegeons";

/**
* The different action that can be done on entries
**/
export enum Actions {
  Enter,
  Left,
  Right,
}

/**
* @typedef {Object} Entry             - A menu entry
* @param T                            - Type of the value stored in the entry
* @property {string} name             - The name to display for the entry
* @property {function} action         - Callback when an action made on the entry
* @property {function} visualizer     - Transform a value into a displayable string
* @property {function} getValue       - Get the value of the entry
* @property {GameObjects.Text} repr   - The ingame object representing the entry
**/
type Entry<T> = {
  name: string;
  action: (act: Actions) => void;
  visualizer?: (value: T) => string;
  getValue?: () => T;
  repr?: GameObjects.Text;
}

export default class MenuTemplate {
  /**
  * Array containing the entries of this menu
  * @type {Entry<number | string>[]}
  **/
  private entries: Entry<number | string>[];

  /**
  * The scene the menu belong to
  **/
  private scene: Scene;

  /**
  * The step (in px) between two entry)
  **/
  private step: number;

  /**
  * The index of the currently selected entry
  **/
  private selection = 0;

  /**
  * The game object representing the selector
  **/
  private selector?: GameObjects.Text;

  /**
  * The padding (in px) with the top border
  **/
  private paddingTop = 50;

  /**
  * The padding (in px) with the left border
  **/
  private paddingLeft = 200;

  /**
  * The font size used to display text
  **/
  private fontSize = 34;

  /**
  * The color of the text
  **/
  private color = "#fff";

  /**
  * The alignement of the text
  **/
  private align = "center";

  /**
  * The font family to use
  **/
  private family = "Mosco_Mule";

  private textOpt = () => { return {
    fontSize: `${this.fontSize}px`,
    color: this.color,
    align: this.align,
    fontFamily: this.family,
  }};

  constructor(
    entries: Entry<number | string>[],
    scene: Scene,
    paddingTop?: number,
    paddingLeft?: number,
  ) {

    this.entries = entries;
    this.scene = scene;
    if(this.scene.game instanceof Swipegeons && this.scene.game.isMobile) this.fontSize = 54;
    if (paddingTop) this.paddingTop = paddingTop;
    if (paddingLeft) this.paddingLeft = paddingLeft;
    this.step = this.fontSize + 2;
  }

  /**
  * Add an entry to the menu
  * @param {Entry<number | string>} entry - The entry to add
  * @param {number?} pos                  - The position of the new entry (default: the end of the list)
  * @returns {MenuTemplate} this
  **/
  public addEntry(entry: Entry<number | string>, pos?: number): MenuTemplate {
    if (pos) {
      const beg = this.entries.slice(0, pos - 1);
      const end = this.entries.slice(pos);
      beg.push(entry);
      this.entries = beg.concat(end);
    } else {
      this.entries.push(entry);
    }
    return this;
  }


  /**
  * Reset the selector to the 0 position
  **/
  public reInitSelection(): void {
    this.selection = 0;
    if (this.selector) {
      this.selector.setPosition(
        this.paddingLeft - 60, this.paddingTop + this.selection * this.step,
      );
    }
  }

  /**
  * Remove an entry
  * @param {string | number} name - The name of the entry or its index
  * @returns {MenuTemplate} this
  **/
  public removeEntry(name: string | number): MenuTemplate {
    if (typeof name === 'number') {
      this.entries.splice(name, 1);
    } else {
      this.entries = this.entries.filter((v) => v.name !== name);
    }
    return this;
  }

  private getPosition(select: number): number {
    const middle = this.scene.cameras.main.height / 2;
    return (select - Math.ceil(this.entries.length/2)) * this.step + middle;
  }

  /**
  * Draw the menu on the screen
  * @return {MenuTemplate} this
  **/
  public draw(): MenuTemplate {
    // I know what I'm doing, don't worry
    /* eslint-disable no-param-reassign */
    this.entries.forEach((entry: Entry<number | string>, index: number) => {
      if (entry.repr == null) entry.repr = this.scene.add.text(0, 0, '', this.textOpt());
      entry.repr.setPosition(this.paddingLeft, this.getPosition(index));
      if (entry.visualizer != null && entry.getValue != null) {
        entry.repr.setText(`${entry.name}: ${entry.visualizer(entry.getValue())}`);
      } else {
        entry.repr.setText(`${entry.name}`);
      }
    });
    /* eslint-enable no-param-reassign */

    if (this.selector == null) this.selector = this.scene.add.text(
      this.paddingLeft - 60,
      this.getPosition(this.selection),
      '>', this.textOpt()
    );
    this.selector.setPosition(this.paddingLeft - 60, this.getPosition(this.selection));

    return this;
  }

  /**
  * Go one item up
  * @returns {MenuTemplate} this
  **/
  public keyUp(): MenuTemplate {
    if (this.selection > 0) {
      this.selection -= 1;
      this.selector?.setY(this.getPosition(this.selection));
    }

    return this;
  }

  /**
  * Go one item down
  * @returns {MenuTemplate} this
  **/
  public keyDown(): MenuTemplate {
    if (this.selection < this.entries.length - 1) {
      this.selection += 1;
      this.selector?.setY(this.getPosition(this.selection));
    }

    return this;
  }

  /**
  * Select an item (if possible) that is at those coordinate
  * @returns {MenuTemplate} this
  **/
  public select(x: number, y: number): MenuTemplate {
    const selection = this.entries.reduceRight((select, entrie, index) => {
      if(entrie.repr == null) return select;
      if(x > entrie.repr.x && x < entrie.repr.x + entrie.repr.width &&
         y > entrie.repr.y && y < entrie.repr.y + entrie.repr.height) return index;
      return select;
    }, -1);

    if(selection >= 0) this.selection = selection;
    this.draw();

    return this;
  }

  /**
  * Send an actions to the menu
  * @param {Actions} act - The action to execute
  * @returns {MenuTemplate} this
  **/
  public keyPressed(act: Actions): MenuTemplate {
    const selection = this.entries[this.selection];
    selection.action(act);
    if (selection.repr != null && selection.visualizer != null && selection.getValue != null) {
      selection.repr.setText(`${selection.name}: ${selection.visualizer(selection.getValue())}`);
    }
    return this;
  }

  /**
  * Hide the menu
  * @returns {MenuTemplate} this
  **/
  public hide(): MenuTemplate {
    // I know what I'm doing, don't worry
    /* eslint-disable no-param-reassign */
    this.entries.forEach((entry) => {
      if (entry.repr) entry.repr.visible = false;
    });
    /* eslint-enable no-param-reassign */

    if(this.selector) this.selector.visible = false;

    return this;
  }

  /**
  * Show the menu
  * @returns {MenuTemplate} this
  **/
  public show(): MenuTemplate {
    // I know what I'm doing, don't worry
    /* eslint-disable no-param-reassign */
    this.entries.forEach((entry) => {
      if (entry.repr) entry.repr.visible = true;
    });
    /* eslint-enable no-param-reassign */

    if(this.selector) this.selector.visible = true;

    return this;
  }
}
