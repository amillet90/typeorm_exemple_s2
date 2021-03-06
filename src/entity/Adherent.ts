import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn , OneToMany} from "typeorm";
import {Emprunt} from "./Emprunt";

@Entity({name: "ADHERENTS" })
export class Adherent {
    @PrimaryGeneratedColumn("increment")  //"uuid"
    id: number;

    @Column()
    nom: string;

    @Column("text")
    adresse: string;

    @Column({ type: 'date' , name: "date_paiement"})
    datePaiement: Date;

    @OneToMany((type) => Emprunt, emprunt => emprunt.adherent)
    emprunts: Emprunt[];
}
