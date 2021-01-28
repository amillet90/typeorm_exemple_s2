import { Column, Entity, PrimaryGeneratedColumn , ManyToOne, JoinColumn } from "typeorm";
import {Auteur} from "./Auteur";
import {Oeuvre} from "./Oeuvre";
import {Exemplaire} from "./Exemplaire";
import {Adherent} from "./Adherent";

// @JoinColumn({ name: "adherent_id" })
// @JoinColumn({ name: "auteur_id" })

@Entity({name: "EMPRUNTS" })
export class Emprunt {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Adherent, (adherent) => adherent.emprunts , { nullable: true })
    @JoinColumn({ name: "adherent_id" })
    adherent: Adherent;

    @ManyToOne((type) => Exemplaire, (exemplaire) => exemplaire.emprunts , { nullable: true })
    @JoinColumn({ name: "exemplaire_id" })
    exemplaire: Exemplaire;

    @Column({ type: 'date' , name: "date_emprunt"})   // timestamp ?
    dateEmprunt: Date;

    @Column({ type: 'date', nullable:true , name: "date_rendu"})   // timestamp ?
    dateRendu: Date;

    // https://stackoverflow.com/questions/58240290/typeorm-many-to-many-custom-column-names
}
