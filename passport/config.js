const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require('../postgresql/config');

function initialize(passport) {
    console.log("Initialized");

    const authenticateUser = (email, password, done) => {
        console.log(email, password);
        pool.query(
            `SELECT * FROM radnici WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    const user = results.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: "Lozinka nije ispravna"});
                        }
                    });
                } else {
                    return done(null, false, {
                        message: "Nema korisnika sa tim korisničkim imenom"
                    });
                }
            }
        );
    };

    passport.use(
        new LocalStrategy(
            {usernameField: "email", passwordField: "password"},
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM radnici WHERE id = $1`, [id], (err, results) => {
            if (err) {
                return done(err)
            }
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;
