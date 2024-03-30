import express from 'express';
import passport from 'passport';
import * as ctrlAuthLocal from '../controllers/ctrlAuthLocal.js';

const router = express.Router();

router.get("/", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.send("You logged out successfully.");
    });
  });

export default router;