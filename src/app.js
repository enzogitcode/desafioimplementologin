import express from 'express';
const app = express();
const PUERTO = 8080;
import "./database.js"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'))

import exphbs from 'express-handlebars'
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


//cookie parser & session
import session from 'express-session';
import cookieParser from 'cookie-parser';
app.use(cookieParser())
import MongoStore from 'connect-mongo';
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://coder:codercoder1@cluster0.j9ubv2z.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Rutas
import usersRouter from "./routes/user.router.js"
import sessionsRouter from "./routes/session.router.js"
import viewsRouter from './routes/views.router.js'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
app.use("/", viewsRouter)
app.use ("/api", productRouter)
app.use ("/api", cartRouter)
app.use("/api/users", usersRouter)
app.use ("/api/sessions", sessionsRouter)

//cookies
app.get(("/"), (req, res) => {
    res.send("Desafío Login Backend")
})

app.get("/setcookie", (req, res) => {

})

//Listen
app.listen(PUERTO, () => { console.log(`Escuchando el puerto ${PUERTO}`) })
