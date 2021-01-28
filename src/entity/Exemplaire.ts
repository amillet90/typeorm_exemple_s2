import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {Auteur} from "./Auteur";
import {Oeuvre} from "./Oeuvre";
import {Emprunt} from "./Emprunt";

@Entity({name: "EXEMPLAIRES" })
export class Exemplaire {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    etat: string;

    @Column({ type: 'date', name: 'date_achat' })   // timestamp ?
    dateAchat: Date;

    @Column({type: 'text', nullable: true})
    prix: string;

    @ManyToOne((type) => Oeuvre, (oeuvre) => oeuvre.exemplaires , { nullable: true })
    @JoinColumn({ name: "oeuvre_id" })
    oeuvre: Oeuvre;

    @OneToMany((type) => Emprunt, emprunt => emprunt.exemplaire)
    emprunts: Emprunt[];

// https://stackoverflow.com/questions/58240290/typeorm-many-to-many-custom-column-names
}
