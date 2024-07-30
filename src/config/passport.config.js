import passport from 'passport';
import UserModel from '../models/users.model.js'

import { createHash, isValidPassword } from '../utils/hashbcrypt.js'
import { Strategy } from 'passport-local';
import local from 'passport-local'
const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use("register", new Strategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            let user = await UserModel.findOne({ email })
            if (user) {
                return done(null, false)
            }
            let newUser = {
                first_name, 
                last_name, 
                email, 
                age, 
                password: createHash(password)
            }
            let result = await UserModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))
    passport.use("login", new LocalStrategy({ usernameField: "email" },
        async (email, password, done) => {
            try {
                let user = await UserModel.findOne({ email })
                if (!user) {
                    console.log("No existe un usuario con ese email")
                    return done(null, false)
                }
                if (!isValidPassword(password, user)) {
                    return done(null, false)
                }
                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }

    ))
    passport.serializeUser((user, done) => { done(null, user._id) })
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id })
        done(null, user)
    })
}

export default initializePassport
