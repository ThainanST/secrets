import express from 'express';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';
const router = express.Router();

router.get("/", ctrlAuthLocal.routeSecrets);

export default router;