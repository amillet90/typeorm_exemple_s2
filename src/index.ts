import "reflect-metadata";
import {createConnection} from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import nunjucks from "nunjucks";
import dateFilter from "nunjucks-date-filter";
import path from "path";
// import moment from "moment";
import { indexRouter } from "./controller/IndexController";
import { auteurRouter } from "./controller/AuteurController";
import { oeuvreRouter } from "./controller/OeuvreController";
import moment from "moment";

createConnection().then(async _connection => {

    // Create express app
    const app = express();

    // Setup express app
    app.use(morgan('dev'));                             // Log requests to the console
    app.use(bodyParser.urlencoded({ extended: true })); // Parse request body

    // Setup template rendering with nunjucks
    let env = nunjucks.configure(path.join(__dirname, 'templates'), {
        autoescape: true,
        express: app,
    });
    env.addFilter('date', dateFilter);

    env.addFilter('asyncFilter', function(val, callba) {
        if (val instanceof Date)
        {
            let dateResult = moment(val, "DD/MM/YYYY").format("DD-MM-YYYY");
            return dateResult;
        }
        else return val;
    }, false);


    // Setup static folder
    app.use('/static', express.static(path.join(__dirname, 'static')));

    // Security middleware

    // Setup routes
    app.use('/', indexRouter);
    app.use('/auteur', auteurRouter);
    app.use('/oeuvre', oeuvreRouter);

    // Start express server
    app.listen(3000);

    console.log("Express server is launched at port 3000. Open http://localhost:3000/");

}).catch(error => console.log(error));
