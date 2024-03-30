import express from 'express';
import * as taskController from '../controllers/ctrlAuthLocal.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home.ejs");
});

export default router;