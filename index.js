import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import {Strategy} from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

import routeHome from './app/routes/routeHome.js';
import routeLoginLocal from './app/routes/routeLoginLocal.js';
import routeLoginGoogle from './app/routes/routeLoginGoogle.js';
import routeRegisterLocal from './app/routes/routeRegisterLocal.js';
import routeSecrets from './app/routes/routeSecrets.js';
import routeSecretsGoogle from './app/routes/routeSecretsGoogle.js';
import routeSubmit from './app/routes/routeSubmit.js';
import routeLogout from './app/routes/routeLogout.js';
import * as ctrlAuthLocal from './app/controllers/ctrlAuthLocal.js';

const app = express();
const port = 3000;
env.config();

app.use( session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false,           
  saveUninitialized: true, 
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 dia // 10° passo
  }
}))
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.use(passport.initialize());
app.use(passport.session());
const saltRounds = process.env.SALT_ROUNDS;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();


app.use("/", routeHome);
app.use('/login', routeLoginLocal);
app.use('/auth/google', routeLoginGoogle);
app.use('/register', routeRegisterLocal);
app.use("/secrets", ctrlAuthLocal.isAuthenticated, routeSecrets);
app.use('/auth/google/secrets', routeSecretsGoogle);
app.use("/submit", ctrlAuthLocal.isAuthenticated, routeSubmit);
app.use("/logout", ctrlAuthLocal.isAuthenticated, routeLogout);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export {
  app,
  db,
  passport,
  bcrypt,
  saltRounds,
  GoogleStrategy,
  env,
};