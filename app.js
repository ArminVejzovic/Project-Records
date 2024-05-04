require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const expressPort = process.env.EXPRESS_PORT;
const httpServer = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const pool = require('./postgresql/config');

const initializePassport = require("./passport/config");
initializePassport(passport);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('app'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(cors({ origin: ['http://localhost:4000', 'http://localhost:3000'], credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.use(
    session({
        secret: 'sigurnost_sigurnost',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
    console.log(req.session.flash.error);
    res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, async (req, res) => {
    const uloga = req.user.uloga;

    switch (uloga) {
        case 'administrator':
            res.render("adminDashboard", { user: req.user });
            break;
        case 'menadzer':
            const projects = await pool.query('SELECT * FROM projekti');
            res.render('menadzerDashboard', { user: req.user, projects: projects.rows });
            break;
        case 'radnik':
            res.render("radnikDashboard", { user: req.user });
            break;
    }
});

app.get("/users/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.render("index", { message: "Uspješno ste se odjavili" });
    });
});

app.post(
    "/users/login",
    passport.authenticate("local", {
        successRedirect: "/users/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })
);

app.use(checkNotAuthenticated);

const unosPrisustvaRouter = require('./routes/unosPrisustva');
app.use(unosPrisustvaRouter);

const slanjeObavjestenjaNaMail = require('./routes/slanjeObavjestenjaNaMail');
app.use(slanjeObavjestenjaNaMail);

const projektiRouter = require('./routes/projekti');
app.use(projektiRouter);
const uspjehRouter = require('./routes/uspjeh');
app.use(uspjehRouter);

// Administrator - Admin
const adminKreirajProjekatRouter = require('./routes/adminKreirajProjekat');
const adminDodjelaProjekataRadnicimaRouter = require('./routes/adminDodajProjekatRadnicima');
const adminAktivnostZaposlenihRouter = require('./routes/adminAktivnostZaposlenih');
const adminDodajKorisnikaRouter = require('./routes/adminDodajKorisnika');
const adminEditInfoKorisnikaRouter = require('./routes/adminEditInfoKorisnika');
const adminObrisiKorisnikaRouter = require('./routes/adminObrisiKorisnika');
const adminDodjelaHijerarhijeRouter = require('./routes/adminDodjelaHijerarhije');

app.use(adminKreirajProjekatRouter);
app.use(adminDodjelaProjekataRadnicimaRouter);
app.use(adminAktivnostZaposlenihRouter);
app.use(adminDodajKorisnikaRouter);
app.use(adminEditInfoKorisnikaRouter);
app.use(adminObrisiKorisnikaRouter);
app.use(adminDodjelaHijerarhijeRouter);

// Menadzer
const menadzerKreirajProjekatRoutes = require('./routes/menadzerKreirajProjekat');
const menadzerDodavanjeTaskaRoutes = require('./routes/menadzerDodavanjeTaska');
const menadzerDodjeliRadnikaNaProjekatRoutes = require('./routes/menadzerDodjeliRadnikaNaProjekat');
const menadzerPracenjeNapretkaProjektaRoutes = require('./routes/menadzerPracenjeProjekta');
const menadzerIzvjestajiRoutes = require('./routes/menadzerIzvjestaji');

app.use(menadzerKreirajProjekatRoutes);
app.use(menadzerDodavanjeTaskaRoutes);
app.use(menadzerDodjeliRadnikaNaProjekatRoutes);
app.use(menadzerPracenjeNapretkaProjektaRoutes);
app.use(menadzerIzvjestajiRoutes);

// Radnik
const radnikRadNaProjektimaRouter = require('./routes/radnikRadNaProjektima');
const radnikIzvjestajRadaRouter = require('./routes/uIzvjestajRada');

app.use(radnikRadNaProjektimaRouter);
app.use(radnikIzvjestajRadaRouter);

const staticPort = process.env.STATIC_PORT;

const staticMiddleware = serveStatic(path.join(__dirname, 'public'), {
    index: ['indexx.html']
});

const staticServer = httpServer.createServer((req, res) => {
    const done = finalhandler(req, res);
    staticMiddleware(req, res, done);
});

const ioStatic = socketIo(staticServer, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"]
    }
});

ioStatic.on("connection", function (socket){
    socket.on("newuser", function (username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function (username){
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", function (message){
        socket.broadcast.emit("chat", message);
    })
})

staticServer.listen(staticPort, () => {
    console.log(`Static server listening on port ${staticPort}`);
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/users/login");
}

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(expressPort, () => {
    console.log(`Server listening on port ${expressPort}`);
});

module.exports = app;