export class SecurityController {
    async authenticate(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    // async role(role, req, res, next) {
    //     if (req.asRole(role)) {
    //         return next();
    //     } else {
    //         res.redirect('/login');
    //     }
    // }
    // async voters(role, req, res, next) {
    //     if (req.asRole(role)) {
    //         return next();
    //     } else {
    //         res.redirect('/login');
    //     }
    // }
}