import Three from "three"
export class Vector extends Three.Vector3 {
  // Accept creation of a vector with no arguments, three strings or three numbers
  constructor(x?: number | string, y?: number | string, z?: number | string) {
    super(
      x ? (typeof x === "string" ? parseFloat(x) : x) : 0,
      y ? (typeof y === "string" ? parseFloat(y) : y) : 0,
      z ? (typeof z === "string" ? parseFloat(z) : z) : 0
    )
  }
}