import express from 'express';
const app= express();
const PUERTO= 8080;
app.use (express.json ());
app.use (express.urlencoded ({extended:true}));
app.use(express.static('./src/public'))

import exphbs from 'express-handlebars'
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

import cookieParser from 'cookie-parser';
import session from 'express-session';

/* import SocketManager from '../copiado.js';
new SocketManager(httpServer); */ //




app.get (("/"), (req, res) =>{
res.send ("Desafío Login Backend")
})
app.listen (PUERTO, ()=> { console.log(`Escuchando el puerto ${PUERTO}`)})
