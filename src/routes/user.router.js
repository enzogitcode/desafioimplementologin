import express from 'express'
const router = express.Router();
import UserModel from '../models/users.model.js';
const userModel = new UserModel
import { createHash } from '../utils/hashbcrypt.js';
import passport from 'passport';
/* router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body
    try {
        const existUser = await UserModel.findOne({ email: email })
        if (existUser) {
            return res.status(400).send("El correo ya está registrado")
        }
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role
        })

        req.session.login = true;
        req.session.user = { ...newUser._doc };

        res.redirect('/profile')

    } catch (error) {
        res.status(500).send("Error al crear el usuario")
        console.log(error)
    }
}) */
//Versión Passport (Desafío Refactor a nuestro Login)
router.post("/", passport.authenticate("register", {
    failureRedirect: "/filedregister"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales inválidas")

    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    req.session.login = true;
    res.redirect("/profile")


})
export default router;