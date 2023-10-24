import { PrimaryGeneratedColumn, Column } from "typeorm"
import { Thing as ApiThing } from "../../Api/model/thing"

export class Thing implements ApiThing {

  @PrimaryGeneratedColumn("uuid")
  public id!: string

  @Column()
  public authorid: string

}