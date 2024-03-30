import { db } from "../../index.js";

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
    const myQuery = "INSERT INTO users (email, password) VALUES ($1, $2)";
    const myValues = [email, password];
    db.query(myQuery, myValues, (err, res) => {
      if (err) {
        console.error("Error registering user:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export const routeLoginLocal = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("username:", username);
  console.log("password:", password);

  const objUser = await getUser(username);
  try {
    //
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

export const routeRegisterLocal = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("username:", username);
  console.log("password:", password);

  try {
    const isEmail = await checkEmail(username);
    if (isEmail) {
      res.send("This e-mail already exist.");
    } else {
      await registerUser(username, password);
    res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.send("Register error");
  }
};