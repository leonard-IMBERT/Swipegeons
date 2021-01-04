import { GameObjects, Scene } from "phaser";
import Vector from "../utils/Vector";

export default class Hero extends GameObjects.IsoTriangle {
  private static size = 15;
  private static heroColor = 0x000055;

  private objective: Vector;
  private speed = 5;

  constructor(scene: Scene, x?: number, y?: number) {
    super(scene, x, y, Hero.size);
    this.fillColor = Hero.heroColor;

    this.objective = new Vector(scene.cameras.main.width/2, scene.cameras.main.height/2);
  }

  public get pos(): Vector {
    return new Vector(this.x, this.y);
  }

  public isOnTarget(): boolean {
    return this.objective.minus(this.pos).norme() <= this.speed;
  }

  public setObjective(v: Vector): void {
    this.objective = v;
  }

  public update(): void {
    const target = this.objective.minus(this.pos);
    if(target.norme() > this.speed) {
      const speed = target.times(this.speed/target.norme());
      this.setX(this.x + speed.x);
      this.setY(this.y + speed.y);
      if(speed.x > 0.1) this.setRotation(Math.PI/2);
      else if(speed.x < -0.1) this.setRotation(-Math.PI/2);
      else if(speed.y < -0.1) this.setRotation(0);
      else if(speed.y > 0.1) this.setRotation(Math.PI);
      else this.setRotation(-Math.PI/2)
    }
  }

}
