import passport from 'passport';
import UserModel from '../models/users.model.js'

import GitHubStrategy from "passport-github2";

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
//Github
passport.use("github", new GitHubStrategy({
    clientID: "Iv23liFwG3UFKQwE5ra6",
    clientSecret: "574ba4f20c486931fea3e4c5b1f37198ce8207f3",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
},
    async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile)
        try {
            let user = await UserModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 33,
                    email: profile._json.email,
                    password: ""
                }
                let result = await UserModel.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }
));

export default initializePassport
