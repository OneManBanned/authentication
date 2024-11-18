import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import pkg from "pg";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from 'passport-local';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pool = new Pool({
    connectionString: `postgres://${process.env.USER}:${process.env.PASSWORD}@localhost:${process.env.PORT}/${process.env.DATABASE}`
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.get("/sign-up", (req, res) => res.render("sign-up-form"));
app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
});



app.listen(3000, () => console.log(`app listening on port 3000!`));

