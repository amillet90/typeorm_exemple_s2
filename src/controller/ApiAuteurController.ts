import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Auteur } from "../entity/Auteur";
import {getConnection} from "typeorm";

export const auteurRouter = express.Router();

auteurRouter.get('/auteurs', async (_req: Request, res: Response) => {
    const items = await getRepository(Auteur).find();
    /*
    await connection.getRepository(Auteur)
            .createQueryBuilder('auteur')
            .select('auteur.nom')
            .leftJoinAndSelect("auteur.oeuvres", "oeuvre")
            .groupBy('auteur.id')
            .getRawMany();
     */
    const auteurs = await getConnection().query("SELECT au.nom, au.prenom , au.id , count(oe.id) as nbrOeuvre" +
        "        FROM  AUTEURS au" +
        "        LEFT JOIN OEUVRES oe ON au.id=oe.auteurId" +
        "        GROUP BY au.nom, au.prenom , au.id" +
        "        ORDER BY au.nom ;");

    console.log(auteurs);
    // createQueryBuilder()
    //     .select("auteur")
    //     .from(Auteur, "auteur")
    //     .where("user.id = :id", { id: 1 }) .getOne();
    res.render('auteur/showAuteurs.html', { auteurs: auteurs });
});

auteurRouter.post('/auteurs', async (req: Request, res: Response) => {
    const repoAuteur = getRepository(Auteur);

    let auteur = new Auteur();
    auteur.nom = req.body.nom;
    auteur.prenom = req.body.prenom;
    // const auteurEntity = repoAuteur.create(auteur);
    //const item = repoAuteur.create(req.body);
    await repoAuteur.save(auteur).catch(error => console.log(error));
    //  await connection.manager.save(auteur);
    res.redirect('/auteur/afficherAuteurs');
});


auteurRouter.delete('/auteurs/:id', async (req: Request, res: Response) => {
    const repo = getRepository(Auteur);
    const item = await repo.findOne(req.params.id);
    if (item)
        repo.remove(item);
    res.redirect('/auteur/afficherAuteurs');
});



auteurRouter.put('/auteurs', async (req: Request, res: Response) => {
    const repo = getRepository(Auteur);
    let id = req.body.id;
    const auteur = await repo.findOne(req.body.id);
    if(auteur)
    {
        auteur.nom = req.body.nom;
        auteur.prenom = req.body.prenom;
        //const item = repo.create(req.body);
        repo.save(auteur).catch(error => console.log(error));
        return auteur;
    }
    res.status(400);
    return {};
});