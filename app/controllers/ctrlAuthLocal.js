import { Strategy } from "passport-local";
import { 
  db,
  passport,
  bcrypt,
  saltRounds,
  GoogleStrategy,
} from "../../index.js";

import { config } from 'dotenv';
config();

export const checkPassword = (objUser, password) => {
  if (objUser.password === password) {
    return true;
  } else {
    return false;
  }
}

export const getUser = async (email) => {
  return new Promise((resolve, reject) => {
    const myQuery = "SELECT * FROM users WHERE email = $1";
    const myValues = [email];
    db.query(myQuery, myValues, (err, res) => {
      if (err) {
        console.error("Error getting user:", err);
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

export const checkEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const myQuery = "SELECT * FROM users WHERE email = $1";
    const myValues = [email];
    db.query(myQuery, myValues, (err, res) => {
      if (err) {
        console.error("Error checking email:", err);
        reject(err);
      } else {
        resolve(res.rows.length > 0);
      }
    });
  });
};

export const registerUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    const myQuery = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
    const myValues = [email, password];
    db.query(myQuery, myValues, (err, res) => {
      if (err) {
        console.error("Error registering user:", err);
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

export const saveSecret = async (id, secret) => {
  return new Promise((resolve, reject) => {
    const myQuery = "UPDATE users SET secret = $1 WHERE id = $2 RETURNING *";
    const myValues = [secret, id];
    db.query(myQuery, myValues, (err, res) => {
      if (err) {
        console.error("Error updating secret:", err);
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });

};

export const isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.send("you need to login");
}

export const routeLoginLocal = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const objUser = await getUser(username);
  try {
    if (checkPassword(objUser, password)) {
      res.render("secrets.ejs", {secret: "teste"});
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.send("Login error");
  }
  };

passport.use( "local",
  new Strategy( async function verify(username, password, cb) {
    try {
      const objUser = await getUser(username);

      if(Object.keys(objUser).length > 0) {
        const storedHashedPassword = objUser.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) =>{
          if(err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if(valid) {
              //Passed password check
              return cb(null, objUser);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        })
      } else {
        //User not found
        return cb("User not found", false);
      }
    } catch (err) {
      console.error(err);
    }

  })
);

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
};

const googleStrategyCallback = async (accessToken, refreshToken, profile, cb) => {
  const userEmail = profile.email;  
  try {
    const objUser = await getUser(userEmail);
    if (objUser !== undefined) { // user exists
      return cb(null, objUser);
    } else {
      const mocPassword = "google";
      const objUserRegistered = await registerUser(userEmail, mocPassword);
      return cb(null, objUserRegistered);
    }
  } catch (err) {
    console.error(err);
    return cb(err);
  }
};

passport.use(
  "google",
  new GoogleStrategy(
    googleStrategyOptions,
    googleStrategyCallback
  )
);

export const routeRegisterLocal = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // console.log("username:", username);
  // console.log("password:", password);

  try {
    const isEmail = await checkEmail(username);
    if (isEmail) {
      res.send("This e-mail already exist.");
    } else {
      bcrypt.hash(password, parseInt(saltRounds), async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const user = await registerUser(username, hash);
          req.login(user, (err)=>{
            // console.log("User registered:", user);
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.send("Register error");
  }
};

export const routeSecrets = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await getUser(email);

    if (user.secret === null) {
      res.render("secrets.ejs", {secret: "You have no secret yet."});
    } else {
      res.render("secrets.ejs", {secret: user.secret});
    }
  } catch (error) {
    res.send("Error getting secret");
    console.error(error);
  }
};

export const routeSubmit = async (req, res) => {
  const secret = req.body.secret;
  const id     = req.user.id;

  try {
    const user = await saveSecret(id, secret);
    res.send("Secret saved");
  } catch (error) {
    console.error(error);
    res.send("Error saving secret");
  }
};

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export {
  passport
}