import {check} from "express-validator";

export const validatorOeuvre = [
    check('auteur').not().isEmpty().withMessage('Veuillez selectionner un auteur'),
    check('titre').isLength({min : 3}).withMessage('Le nom doit faire + de trois lettres'),
    // check('auteur').isInt().withMessage('Valeur invalide'),
    check('dateParution').isDate({format: 'DD-MM-YYYY'}).withMessage('Veuillez entrer une date valide JJ/MM/AAAA'),
    check('photo').not().isEmpty().withMessage('Veuillez entrer un nom de fichier valide'),
];