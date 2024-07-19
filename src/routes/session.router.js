import express from "express";
const router = express.Router();
import UserModel from "../models/users.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    first_name: user.first_name
                }
                res.redirect("/profile");
            } else {
                res.status(401).send("Contraseña no valida");
            }
        }
        else {
            res.status(404).send("Usuario no encontrado");
        }

    } catch (error) {
        res.status(400).send("Error en el Login");
    }
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

export default router; 