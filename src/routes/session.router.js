import express from "express";
const router = express.Router();
import UserModel from "../models/users.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";

/* router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                };
                res.redirect("/api/products");
            } else {
                res.status(401).send("Contraseña no valida");
            }
        }
        else {
            res.status(404).send("Usuario no encontrado");
        }

    } catch (error) {
        console.log(error)
        res.status(400).send("Error en el Login");
    }
}) */

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/");
})
//Versión para passport
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    if (!req.user) {
        res.status(400).send("Credenciales Inválidas")
    }
    req.session.user = {
        email: req.user.email,
        age: req.user.age,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role
    };
    req.session.login = true
    res.redirect("/profile");
})
router.get("/faillogin", async (req, res) => {
    res.send("Error al ingresar en el login")
})
//Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/profile");
})

export default router; 