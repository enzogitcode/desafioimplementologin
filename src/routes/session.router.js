import express from 'express'
const router = express.Router();
import UserModel from '../models/users.model.js';

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if (user) {
            if (user.password === password) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    first_name: user.first_name
                }
                res.redirect("/profile")
            }
            else {
                res.status(401).send("La contraseña no válida")
            }
        }
        else {
            res.status(404).send("Usuario no encontrado")

        }
    }
    catch (error) {
res.status(400).send("Error en el Login")

    }
})
export default router;