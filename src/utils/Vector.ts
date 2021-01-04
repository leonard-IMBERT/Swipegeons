export default class Vector {

  public static Zero = new Vector(0, 0);
  public static angle(a: number): Vector { return new Vector(Math.cos(a), Math.sin(a)); }
  public static eX = new Vector(1, 0);
  public static eY = new Vector(0, 1);

  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public minus(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  public plus(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  public dot(v: Vector): number {
    return Math.sqrt(this.x * v.x + this.y * v.y);
  }

  public norme(): number { return this.dot(this); }

  public times(n: number): Vector {
    return new Vector(this.x * n, this.y * n);
  }

  public getAngle(): number {
    return Math.atan(this.y/this.x) % Math.PI;
  }

}
