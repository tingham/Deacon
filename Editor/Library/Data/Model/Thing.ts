import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Thing {

  @PrimaryGeneratedColumn("uuid")
  public id!: string

  @Column()
  public Name: string = ""

  @Column()
  public Description: string = ""

}