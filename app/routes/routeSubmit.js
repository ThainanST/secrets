import express from 'express';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.render("submit.ejs");
});

router.post("/", ctrlAuthLocal.routeSubmit);

export default router;