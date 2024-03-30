import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import bcrypt from "bcrypt";
import env from "dotenv";

import routeHome from './app/routes/routeHome.js';
import routeLoginLocal from './app/routes/routeLoginLocal.js';
import routeRegisterLocal from './app/routes/routeRegisterLocal.js';
import routeSecrets from './app/routes/routeSecrets.js';
import routeSubmit from './app/routes/routeSubmit.js';

const app = express();
const port = 3000;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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
app.use('/register', routeRegisterLocal);
app.use("/secrets", routeSecrets);
app.use("/submit", routeSubmit);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export {
  app,
  db
};