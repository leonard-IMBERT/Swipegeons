/**
* A wraparound for 2D vectors
**/
export default class Vector {

  /**
  * The zero vector
  **/
  public static Zero = new Vector(0, 0);

  /**
  * Create a vector with the angle `a` with the x axis
  * @param {number} a - The angle (in rad) the vector will have with the x-axis
  **/
  public static angle(a: number): Vector { return new Vector(Math.cos(a), Math.sin(a)); }

  /**
  * A unitary vector on the x axis
  **/
  public static eX = new Vector(1, 0);

  /**
  * A unitary vector on the y axis
  **/
  public static eY = new Vector(0, 1);

  /**
  * x coordinate of the vector
  **/
  public x: number;

  /**
  * y coordinate of the vector
  **/
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }


  /**
  * Substract the vector `v` to this vector.
  * Return a new vector.
  * @param {Vector} v - The vector to substract
  **/
  public minus(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /**
  * Add the vector `v` to this vector.
  * Return a new vector.
  * @param {Vector} v - The vector to add
  **/
  public plus(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /**
  * Do a scalar multiplication between this vector and `v`
  * @param {Vector} v - The vector to multiplicate with
  **/
  public dot(v: Vector): number {
    return Math.sqrt(this.x * v.x + this.y * v.y);
  }

  /**
  * The norm of this verctor
  **/
  public norme(): number { return this.dot(this); }

  /**
  * Multiply the vector by a number `n`
  * @param {number} n - The number to multiply with
  **/
  public times(n: number): Vector {
    return new Vector(this.x * n, this.y * n);
  }

  /**
  * Return the angle of this vector with the x axis
  **/
  public getAngle(): number {
    return Math.atan(this.y/this.x) % Math.PI;
  }

}
