import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation,loginValidation,postCreateValidation } from './validations/auth.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

import { PostController, UserController } from './controllers/index.js'



mongoose
    .connect('mongodb+srv://shukur:wwwwwww@cluster0.8ithriu.mongodb.net/blog?retryWrites=true&w=majority')
    .then( () => console.log('DB Ok'))
    .catch( (err) => console.log('DB error',err));

const PORT = process.env.PORT || 3000;
const app = express();

const storage = multer.diskStorage(
    {
        distination:  ( _, __, cb) => {
            cb(null,'uploads')
        },
        distination: ( _, file, cb) => {
            cb(null, file.originalname)
        }
    }
)

const upload = multer({ storage });

//wwwwwww
app.use(cors())
app.use(express.json())
app.use('/uploads',express.static('uploads'))

app.post('/auth/login',loginValidation,handleValidationErrors,UserController.login)
app.post('/auth/register',registerValidation,handleValidationErrors,UserController.register)
app.get('/auth/me',checkAuth,UserController.getMe)

app.post('/upload',checkAuth, upload.single('image'), (req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id',PostController.getOne)
app.post('/posts',checkAuth,postCreateValidation,handleValidationErrors,PostController.create)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts',checkAuth,postCreateValidation,handleValidationErrors,PostController.update)

app.listen(PORT,(err) => {
    if(err){
        return err
    }
    console.log("server is running")
})