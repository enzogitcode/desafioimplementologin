import express from 'express';
const app = express();
const PUERTO = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'))

import exphbs from 'express-handlebars'
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


//cookie parser & session
import cookieParser from 'cookie-parser';
app.use(cookieParser())
import session from 'express-session';
import FileStore from 'session-file-store';
const fileStore = new FileStore(session)
//usando mongoStorage
import MongoStore from 'connect-mongo';
app.get(("/"), (req, res) => {
    res.send("Desafío Login Backend")
})

app.get("/setcookie", (req, res) => {

})

app.listen(PUERTO, () => { console.log(`Escuchando el puerto ${PUERTO}`) })
