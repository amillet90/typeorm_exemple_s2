import { Column, Entity, PrimaryGeneratedColumn , ManyToOne } from "typeorm";
import {Auteur} from "./Auteur";
import {Oeuvre} from "./Oeuvre";
import {Exemplaire} from "./Exemplaire";
import {Adherent} from "./Adherent";

@Entity({name: "EMPRUNTS" })
export class Emprunt {
    @PrimaryGeneratedColumn()
    id: number;

   @ManyToOne((type) => Adherent, (adherent) => adherent.emprunts , { nullable: true })
        // @JoinColumn({ name: "auteur_id" })
    adherent: Adherent;

    @ManyToOne((type) => Exemplaire, (exemplaire) => exemplaire.emprunts , { nullable: true })
        // @JoinColumn({ name: "auteur_id" })
    exemplaire: Exemplaire;

    @Column({ type: 'date' })   // timestamp ?
    dateEmprunt: Date;

    @Column({ type: 'date', nullable:true })   // timestamp ?
    dateRendu: Date;

    // https://stackoverflow.com/questions/58240290/typeorm-many-to-many-custom-column-names
}
