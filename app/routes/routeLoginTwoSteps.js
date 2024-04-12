import express from 'express';
import passport from 'passport';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';

const router = express.Router();

const objConfigGoogle = {
    scope: ["profile", "email"],
  }

// TODO: implement the two-step login process

router.get("/", passport.authenticate("google", objConfigGoogle));

export default router;