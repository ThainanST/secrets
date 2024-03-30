import express from 'express';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';
const router = express.Router();

router.get("/", (req, res) => {
    if (req.user.secret === null) {
        res.render("secrets.ejs", {secret: "You have no secret yet."});
    } else {
        res.render("secrets.ejs", {secret: req.user.secret});
    }
});

export default router;