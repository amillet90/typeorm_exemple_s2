import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import {Auteur} from "./Auteur";
import {Exemplaire} from "./Exemplaire";

@Entity({name: "OEUVRES" })
export class Oeuvre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;

    @Column({ type: 'date' })   // timestamp ?
    dateParution: Date;

    @Column({type: 'text', nullable: true})
    photo: string;

    @ManyToOne((type) => Auteur, (auteur) => auteur.oeuvres , { nullable: true })
   // @JoinColumn({ name: "auteur_id" })
    auteur: Auteur;

    @OneToMany((type) => Exemplaire, exemplaire => exemplaire.oeuvre)
    exemplaires: Exemplaire[];

// https://stackoverflow.com/questions/58240290/typeorm-many-to-many-custom-column-names
}
