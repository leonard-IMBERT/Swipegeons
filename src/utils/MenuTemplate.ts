import { GameObjects, Scene } from "phaser";
import Swipegeons from "../Swipegeons";

export enum Actions {
  Enter,
  Left,
  Right,
}

type Entry<T> = {
  name: string;
  action: (act: Actions) => void;
  visualizer?: (value: T) => string;
  getValue?: () => T;
  repr?: GameObjects.Text;
}

export default class MenuTemplate {
  private entries: Entry<number | string>[];

  private scene: Scene;

  private step: number;

  private selection = 0;

  private selector: GameObjects.Text;

  private paddingTop = 50;

  private paddingLeft = 200;

  private fontSize = 34;
  private color = "#fff";
  private align = "center";

  private textOpt = () => { return {
    fontSize: `${this.fontSize}px`,
    color: this.color,
    align: this.align,
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
  }

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

  public reInitSelection(): void {
    this.selection = 0;
    if (this.selector) {
      this.selector.setPosition(
        this.paddingLeft - 60, this.paddingTop + this.selection * this.step,
      );
    }
  }

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

  public draw(): MenuTemplate {
    this.step = this.fontSize + 2;
    // I know what I'm doing, don't worry
    /* eslint-disable no-param-reassign */
    this.entries.forEach((entry: Entry<number | string>, index: number) => {
      if (entry.repr == null) entry.repr = this.scene.add.text(0, 0, '', this.textOpt());
      entry.repr.setPosition(this.paddingLeft, this.getPosition(index));
      if (entry.visualizer != null) {
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

  public keyUp(): MenuTemplate {
    if (this.selection > 0) {
      this.selection -= 1;
      this.selector.setY(this.getPosition(this.selection));
    }

    return this;
  }

  public keyDown(): MenuTemplate {
    if (this.selection < this.entries.length - 1) {
      this.selection += 1;
      this.selector.setY(this.getPosition(this.selection));
    }

    return this;
  }

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

  public keyPressed(act: Actions): MenuTemplate {
    this.entries[this.selection].action(act);
    if (this.entries[this.selection].repr != null
      && this.entries[this.selection].visualizer != null) {
      this.entries[this.selection].repr.setText(
        `${this.entries[this.selection].name}: ${this.entries[this.selection].visualizer(this.entries[this.selection].getValue())}`,
      );
    }
    return this;
  }

  public hide(): MenuTemplate {
    // I know what I'm doing, don't worry
    /* eslint-disable no-param-reassign */
    this.entries.forEach((entry) => {
      if (entry.repr) entry.repr.visible = false;
    });
    /* eslint-enable no-param-reassign */

    this.selector.visible = false;

    return this;
  }


  public show(): MenuTemplate {
    // I know what I'm doing, don't worry
    /* eslint-disable no-param-reassign */
    this.entries.forEach((entry) => {
      if (entry.repr) entry.repr.visible = true;
    });
    /* eslint-enable no-param-reassign */

    this.selector.visible = true;

    return this;
  }
}
