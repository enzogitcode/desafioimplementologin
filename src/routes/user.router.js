import express from 'express'
const router= express.Router();
import UserModel from "../models/users.model.js"
import { createHash } from '../utils/hashbcrypt.js';
router.post("/", async (req, res)=> {
    const {first_name, last_name, email, password, age}= req.body
    try {
        const existUser= await UserModel.findOne({email})
        if (existUser) {
            return res.status(400).send("El correo ya está registrado")
        }
        const newUser= await UserModel.create({
            first_name,
            last_name,
            email,
            password:createHash(password),
            age
        })
        req.session.user ={
            email: newUser.email,
            first_name: newUser.first_name}

    res.status(200).send("Usuario creado con ÉXITO")
    res.redirect ('index')
        
    } catch (error) {
         res.status(500).send("Error al crear el usuario")
    }
})
export default router;