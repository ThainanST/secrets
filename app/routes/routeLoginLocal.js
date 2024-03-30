import express from 'express';
import passport from 'passport';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login.ejs");
});

//router.post("/", ctrlAuthLocal.routeLoginLocal);

router.post("/", passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
})
);

export default router;