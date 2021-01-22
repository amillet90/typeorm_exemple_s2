import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Comment } from "../entity/Comment";

export const guestbookRouter = express.Router();

guestbookRouter.get('/', async (_req: Request, res: Response) => {
    const items = await getRepository(Comment).find();
    res.render('guestbook/index.html', { comments: items });
});

guestbookRouter.post('/send', (req: Request, res: Response) => {
    const repo = getRepository(Comment);

    const item = repo.create(req.body);
    repo.save(item);

    res.redirect('/guestbook');
});

guestbookRouter.get('/delete/:id', async (req: Request, res: Response) => {
    const repo = getRepository(Comment);

    const item = await repo.findOne(req.params.id);

    if (item)
        repo.remove(item);

    res.redirect('/guestbook');
});
