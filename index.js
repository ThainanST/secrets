import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
    res.render("secrets.ejs", {secret: "vtnc"});
});

app.get("/submit", (req, res) => {
    res.render("submit.ejs");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
