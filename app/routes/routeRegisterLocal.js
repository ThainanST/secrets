import express from 'express';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.render("register.ejs");
});

router.post("/", ctrlAuthLocal.routeRegisterLocal);

export default router;