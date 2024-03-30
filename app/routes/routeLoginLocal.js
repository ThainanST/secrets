import express from 'express';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login.ejs");
});

router.post("/", ctrlAuthLocal.routeLoginLocal);

export default router;