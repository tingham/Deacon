import { Column, Entity } from "typeorm"
import { Thing } from "./Thing.js"

@Entity()
export class Transform extends Thing {

  @Column()
  public X: number = 0

  @Column()
  public Y: number = 0

  @Column()
  public Z: number = 0

  @Column()
  public Width: number = 1

  @Column()
  public Height: number = 1

  @Column()
  public Depth: number = 1

  @Column()
  public Yaw: number = 0

  @Column()
  public Pitch: number = 0

  @Column()
  public Roll: number = 0
}