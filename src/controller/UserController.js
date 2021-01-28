import {getRepository} from "typeorm";
import {User} from "../entity/User.js";
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";

class UserController {
    async register(req, res, next) {
        if (req.method === "POST") {
            var errors = validationResult(req);
            if (errors.isEmpty()) {
                var user = await getRepository(User).findOne({where: {username: req.body.username}});
                var errs = []
                if (user) {
                    errs.push({msg: "nom déjà utilisé", param: "username", value: req.body.username});
                }
                if (req.body.password != req.body.password2) {
                    errs.push({msg: "Les mots de passe ne correspondent pas", param: "password", value: ""});
                    errs.push({msg: "Les mots de passe ne correspondent pas", param: "password2", value: ""});
                }
                if (errs.length === 0) {
                    var newUser = {username: req.body.username};

                    newUser.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
                    await getRepository(User).save(newUser).then(() => {
                            req.flash('info', "Compte créé")
                            res.redirect("/");
                            return next();
                        }
                    );
                }
            }
        }
        if (!errors)
            var errs = [];
        else if (errors && !errors.isEmpty())
            var errs = errors.array();
        res.render('register', {errors: errs, csrfToken: req.csrfToken()});
    }
    async login(req, res, next) {
        if (req.method === "POST") {
            var errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.render('login', {csrfToken: req.csrfToken(), errors: errors.array()});
            }
            return next();
        }
        res.render('login', {csrfToken: req.csrfToken(), errors: []});
    }
    async logout(req, res, next){
        req.logout();
        res.redirect('/');
    }
}

export var controller = UserController;