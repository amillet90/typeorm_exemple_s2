import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn , OneToMany} from "typeorm";
import { Oeuvre} from "./Oeuvre";

@Entity({name: "AUTEURS" })
export class Auteur {
    @PrimaryGeneratedColumn("increment")  //"uuid"
    id: number;

    @Column()
    nom: string;

    @Column("text")
    prenom: string;

    @OneToMany((type) => Oeuvre, oeuvre => oeuvre.auteur)
    oeuvres: Oeuvre[];
}
