import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router()

userRouter.get('/', async(req, res) => {
    res.render('register')
})

userRouter.post('/', async(req,res) => {
    const {first_name, last_name, email, password, age} = req.body
    try{
        const response = await userModel.create({first_name, last_name, email, password, age})
        res.status(200).send({message: 'Usuario creado', respuesta: response})
/*         res.redirect(302, '/') */
    } catch(error) {
        res.status(400).send({error: `No se pudo registrar el usuario: ${error}`})
    }
})


export default userRouter