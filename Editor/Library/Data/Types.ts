import * as Three from 'three'
/**
 * This file wraps basic types from dependency libraries as independent types.
 */

export class Vector extends Three.Vector3 {
  constructor(x?: number | string, y?: number | string, z?: number | string) {
    super(
      x ? typeof x == "string" ? parseFloat(x) : x : 0,
      y ? typeof y == "string" ? parseFloat(y) : y : 0,
      z ? typeof z == "string" ? parseFloat(z) : z : 0
    )
  }
 }

export class WindowPoint {
  public x: number = Number.MIN_SAFE_INTEGER
  public y: number = Number.MIN_SAFE_INTEGER
  public get MinimumPoint(): boolean {
    return (this.x == Number.MIN_SAFE_INTEGER && this.y == Number.MIN_SAFE_INTEGER)
  }
  public get Length(): number {
    return this.x * this.y
  }
  public get LengthNormalized(): number {
    return 1.0 / this.Length
  }
  // The direction in angles from the origin to this point
  public get Normal (): number {
    return Math.atan2(this.y, this.x)
  }
  // Monoidal linear interpolation
  public Lerp(toWindowPoint: WindowPoint, t: number): WindowPoint {
    return {x: this.x + (toWindowPoint.x - this.x) * t, y: this.y + (toWindowPoint.y - this.y) * t} as WindowPoint
  }
  // Monoidal smooth-linear interpolation
  public Slerp(toWindowPoint: WindowPoint, t: number): WindowPoint {
    return {x: this.x + (toWindowPoint.x - this.x) * (1 - Math.cos(t * Math.PI)) / 2, y: this.y + (toWindowPoint.y - this.y) * (1 - Math.cos(t * Math.PI)) / 2} as WindowPoint
  }
}

export class Color extends Three.Color {
  constructor(color?: string | number)
  constructor(r?: string | number, g?: string | number, b?: string | number, a?: string | number)
  constructor(...params: any[]) {
    super(
      params.length == 1 ? params[0] : 
        params.length == 3 ? `rgb(${params[0]},${params[1]},${params[2]})` :
          `rgba(${params[0]},${params[1]},${params[2]},${params[3]})`
    )
  }
}
