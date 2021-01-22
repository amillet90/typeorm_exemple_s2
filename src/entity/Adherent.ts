import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn , OneToMany} from "typeorm";
import { Oeuvre} from "./Oeuvre";
import {Emprunt} from "./Emprunt";

@Entity({name: "ADHERENTS" })
export class Adherent {
    @PrimaryGeneratedColumn("increment")  //"uuid"
    id: number;

    @Column()
    nom: string;

    @Column("text")
    adresse: string;

    @Column({ type: 'date' })
    datePaiement: Date;

    @OneToMany((type) => Emprunt, emprunt => emprunt.adherent)
    emprunts: Emprunt[];
}
