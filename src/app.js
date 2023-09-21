import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'
import path from 'path'
import productsRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import userRouter from './routes/users.routes.js'
import sessionRouter from './routes/sessions.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
//import { cartModel } from './models/carts.models.js'

const app = express();
const PORT = 8080

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine('handlebars', engine())//defino que voy a trabajar con handlebars y guardo configuración
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use(cookieParser(process.env.SIGNED_COOKIE)) //firmar cookie
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {usenewUrlParser: true, useUnifiedTopology: true},
        ttl: 60 //tiempo en segundos (120 días = 10368000)
    }),
    secret: process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true
}))

function auth(req,res,next) {
    console.log(req.session.email)
    if(req.session.email == 'adminCoder@coder.com' && req.session.password == 'adminCod3r123') {
        return next() //continua con la ejecución normal de la ruta
    }
    return res.send('No tenes acceso a este contenido')
}


app.get('/admin', auth, (req,res) => {
    res.send('sos admin')
})

app.post('/products', (req,res) => {

     req.session.destroy(() => {
        res.redirect(301, '/')
    })
    
})
//rutas
app.use('/', sessionRouter)
app.use('/register', userRouter)
app.use(express.static(path.join(__dirname, '/public')))
app.use('/products', productsRouter)
app.use('/carts', cartRouter)
app.use('/users', userRouter)
/* app.get('/static', (req,res) => {
    //indicar que plantilla utilizar
    res.render("home", {
        //variables
        
    })
}) */

//cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCoookie', 'Esto es el valor de una cookie', {maxAge:60000, signed: true}).send('Cookie creada') //cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    //res.send(req.cookies) consultar TODAS las cookies
    res.send(req.signedCookies)
})

//server
app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`)
});

//BDD
mongoose.connect(process.env.MONGO_URL)
    .then(async(req, res) => { 
        console.log("DB conectada")
/*         await cartModel.create({})
        const cart = await cartModel.findOne({_id: "65044859b9ff5276a5a5e46d"}).populate('products.id_prod')
        console.log(JSON.stringify(cart)) */
    })
    .catch((error) => console.log("Error en conexion con MongoDB: ", error))



