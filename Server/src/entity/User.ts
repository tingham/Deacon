import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User as ApiUser } from "../../Api/model/user"
import { Thing } from "./Thing"

@Entity()
export class User implements ApiUser {

    @PrimaryGeneratedColumn()
    id: string

    @OneToMany((type) => Thing, (thing) => thing.authorid))
    things: Thing[]
}
