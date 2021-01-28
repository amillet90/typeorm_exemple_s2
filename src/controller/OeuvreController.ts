import express, { Request, Response } from "express";
import {getConnection, getRepository} from "typeorm";
import { Oeuvre } from "../entity/Oeuvre";
import {Auteur} from "../entity/Auteur";
// import {auteurRouter} from "./AuteurController";
import {validatorOeuvre} from "../validator/OeuvreValidator";
import {validationResult} from "express-validator";
import moment from "moment";

export const oeuvreRouter = express.Router();

oeuvreRouter.get('/afficherOeuvres', async (_req: Request, res: Response) => {
    const items = await getRepository(Oeuvre).find();
    const oeuvres = await getConnection().query(" SELECT AUTEURS.nom, OEUVRES.titre, OEUVRES.id,OEUVRES.date_parution, OEUVRES.photo\n" +
        ", COUNT(E1.id) AS nbExemplaire\n" +
        ", COUNT(E2.id) AS nombreDispo\n" +
        "FROM OEUVRES\n" +
        "JOIN AUTEURS ON AUTEURS.id = OEUVRES.auteur_id\n" +
        "LEFT JOIN EXEMPLAIRES E1 ON E1.oeuvre_id = OEUVRES.id\n" +
        "LEFT JOIN EXEMPLAIRES E2 ON E2.id = E1.id\n" +
        "AND E2.id NOT IN (SELECT EMPRUNTS.exemplaire_id FROM EMPRUNTS WHERE EMPRUNTS.date_rendu IS NULL)\n" +
        "GROUP BY OEUVRES.id\n" +
        "ORDER BY AUTEURS.nom ASC, OEUVRES.titre ASC;");
    /*
    SELECT AUTEUR.nom, OEUVRE.titre, OEUVRE.id,OEUVRE.dateParution, OEUVRE.photo
, COUNT(E1.id) AS nbExemplaire
, COUNT(E2.id) AS nombreDispo
FROM OEUVRES
JOIN AUTEURS ON AUTEUR.id = OEUVRE.auteur_id
LEFT JOIN EXEMPLAIRES E1 ON E1.noOeuvre = OEUVRE.noOeuvre
LEFT JOIN EXEMPLAIRES E2 ON E2.noExemplaire = E1.noExemplaire
    AND E2.noExemplaire NOT IN (SELECT EMPRUNT.noExemplaire FROM EMPRUNT WHERE EMPRUNT.dateRendu IS NULL)
GROUP BY OEUVRE.noOeuvre
ORDER BY AUTEUR.nomAuteur ASC, OEUVRE.titre ASC;";
     */
    res.render('oeuvre/showOeuvres.html', { oeuvres: oeuvres });
});


oeuvreRouter.get('/creerOeuvre', async (req: Request, res: Response) => {
    const repo = getRepository(Auteur);
    const auteurs = await repo.find();
    res.render('oeuvre/addOeuvre.html', { auteurs: auteurs});
});

oeuvreRouter.post('/creerOeuvre', validatorOeuvre, async (req: Request, res: Response) => {
    const repoOeuvre = getRepository(Oeuvre);

    let oeuvre = new Oeuvre();
    oeuvre.titre = req.body.titre;
    oeuvre.dateParution = req.body.dateParution;
    oeuvre.photo = req.body.photo;
    oeuvre.auteur = req.body.auteur

    let erreurs = validationResult(req);
    if (erreurs.isEmpty()) {
        const repoAuteur = getRepository(Auteur);
        const auteur = await repoAuteur.findOne(req.body.id);
        oeuvre.auteur = auteur;
     //   console.log(oeuvre)

        let dateparu = moment(oeuvre.dateParution, "DD/MM/YYYY").format("YYYY-MM-DD");
        oeuvre.dateParution=moment(dateparu, 'YYYY-MM-DD').toDate();;
        console.log(dateparu.toString());
        console.log(oeuvre);
        await repoOeuvre.save(oeuvre).catch(error => console.log(error));
        res.redirect('/oeuvre/afficherOeuvres');
    }
    else
    {
        console.log(erreurs);
        console.log(erreurs.mapped());
        const repo = getRepository(Auteur);
        const auteurs = await repo.find();
        res.render('oeuvre/addOeuvre.html',{erreurs: erreurs.mapped(), oeuvre: oeuvre,  auteurs: auteurs});
    }


});


oeuvreRouter.get('/supprimerOeuvre/:id', async (req: Request, res: Response) => {
    const repo = getRepository(Oeuvre);
    const item = await repo.findOne(req.params.id);
    if (item)
        repo.remove(item);
    res.redirect('/oeuvre/afficherOeuvres');
});


oeuvreRouter.get('/modifierOeuvre/:id', async (req: Request, res: Response) => {
    const repoOeuvre = getRepository(Oeuvre);
    const oeuvre = await repoOeuvre.findOne(req.params.id);
    const repoAuteur = getRepository(Auteur);
    const auteurs = await repoAuteur.find();
    let dateparution = moment(oeuvre.dateParution).format("DD/MM/YYYY");

    oeuvre.dateParution=moment(dateparution, 'DD/MM/YYYY').toDate();
    console.log(dateparution); console.log(oeuvre.dateParution);
    res.render('oeuvre/editOeuvre.html', { oeuvre: oeuvre ,  auteurs: auteurs, dateParution: dateparution});
});

oeuvreRouter.post('/modifierOeuvre', validatorOeuvre,async (req: Request, res: Response) => {
    const repo = getRepository(Oeuvre);
    let id = req.body.id;
    const oeuvre = await repo.findOne(req.body.id);
    oeuvre.titre = req.body.titre;
    oeuvre.dateParution = req.body.dateParution;
    oeuvre.photo = req.body.photo;
    oeuvre.auteur = req.body.auteur;

    let erreurs = validationResult(req);
    if (erreurs.isEmpty()) {
        let dateparu = moment(oeuvre.dateParution, "DD/MM/YYYY").format("YYYY-MM-DD");
        oeuvre.dateParution=moment(dateparu, 'YYYY-MM-DD').toDate();
        //const item = repo.create(req.body);
        repo.save(oeuvre).catch(error => console.log(error));
        //  await connection.manager.save(oeuvre);
        res.redirect('/oeuvre/afficherOeuvres');
    }
    else
    {
        console.log(erreurs);
        console.log(erreurs.mapped());
        const repoAuteur = getRepository(Auteur);
        const auteurs = await repoAuteur.find();
        res.render('oeuvre/editOeuvre.html',{erreurs: erreurs.mapped(), oeuvre: oeuvre,   auteurs: auteurs});
    }
});