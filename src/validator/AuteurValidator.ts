import {check, validationResult} from "express-validator";
export const validatorAuteur =  [
        check('nom').isLength({min: 3}).withMessage('Le nom doit faire plus de deux lettres'),
        check('prenom').isLength({min: 3}).withMessage('Le prenom doit faire plus de deux lettres')
    ];