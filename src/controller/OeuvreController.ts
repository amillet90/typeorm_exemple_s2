import express, { Request, Response } from "express";
import {getConnection, getRepository} from "typeorm";
import { Oeuvre } from "../entity/Oeuvre";
import {Auteur} from "../entity/Auteur";
import {auteurRouter} from "./AuteurController";

export const oeuvreRouter = express.Router();

oeuvreRouter.get('/afficherOeuvres', async (_req: Request, res: Response) => {
    const items = await getRepository(Oeuvre).find();
    const oeuvres = await getConnection().query(" SELECT AUTEURS.nom, OEUVRES.titre, OEUVRES.id,OEUVRES.dateParution, OEUVRES.photo\n" +
        ", COUNT(E1.id) AS nbExemplaire\n" +
        ", COUNT(E2.id) AS nombreDispo\n" +
        "FROM OEUVRES\n" +
        "JOIN AUTEURS ON AUTEURS.id = OEUVRES.auteurId\n" +
        "LEFT JOIN EXEMPLAIRES E1 ON E1.oeuvreId = OEUVRES.id\n" +
        "LEFT JOIN EXEMPLAIRES E2 ON E2.id = E1.id\n" +
        "AND E2.id NOT IN (SELECT EMPRUNTS.exemplaireId FROM EMPRUNTS WHERE EMPRUNTS.dateRendu IS NULL)\n" +
        "GROUP BY OEUVRES.id\n" +
        "ORDER BY AUTEURS.nom ASC, OEUVRES.titre ASC;");
    /*
    SELECT AUTEUR.nom, OEUVRE.titre, OEUVRE.id,OEUVRE.dateParution, OEUVRE.photo
, COUNT(E1.id) AS nbExemplaire
, COUNT(E2.id) AS nombreDispo
FROM OEUVRES
JOIN AUTEURS ON AUTEUR.id = OEUVRE.auteurId
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

oeuvreRouter.post('/creerOeuvre', async (req: Request, res: Response) => {
    const repoOeuvre = getRepository(Oeuvre);

    let oeuvre = new Oeuvre();
    oeuvre.titre = req.body.titre;
    oeuvre.dateParution = req.body.dateParution;
    oeuvre.photo = req.body.photo;
    const repoAuteur = getRepository(Auteur);
    const auteur = await repoAuteur.findOne(req.body.id);
    oeuvre.auteur = auteur;
    console.log(oeuvre);

    await repoOeuvre.save(oeuvre).catch(error => console.log(error));
    //  await connection.manager.save(oeuvre);
    res.redirect('/oeuvre/afficherOeuvres');
});


oeuvreRouter.get('/supprimerOeuvre/:id', async (req: Request, res: Response) => {
    const repo = getRepository(Oeuvre);
    const item = await repo.findOne(req.params.id);
    if (item)
        repo.remove(item);
    res.redirect('/oeuvre/afficherOeuvres');
});


oeuvreRouter.get('/modifierOeuvre/:id', async (req: Request, res: Response) => {
    const repo = getRepository(Oeuvre);
    const oeuvre = await repo.findOne(req.params.id);
    res.render('oeuvre/editOeuvre.html', { oeuvre: oeuvre });
});

oeuvreRouter.post('/modifierOeuvre', async (req: Request, res: Response) => {
    const repo = getRepository(Oeuvre);
    let id = req.body.id;
    const oeuvre = await repo.findOne(req.body.id);
    oeuvre.titre = req.body.titre;
    oeuvre.dateParution = req.body.dateParution;
    oeuvre.photo = req.body.photo;
    oeuvre.auteur = req.body.auteur;
    //const item = repo.create(req.body);
    repo.save(oeuvre).catch(error => console.log(error));;
    //  await connection.manager.save(oeuvre);
    res.redirect('/oeuvre/afficherOeuvres');
});