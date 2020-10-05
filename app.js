const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const frontAuthRoutes = require('./routes/front/auth');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const permissionRoutes = require('./routes/permission');
const productRoutes = require('./routes/product');
const frontProductRoutes = require('./routes/front/product');
const brandRoutes = require('./routes/brand');
const frontCartRoutes = require('./routes/front/cart');
require('dotenv').config();


// configuration
const app = express();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req,file,cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(helmet());
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);
app.use(morgan('combined', {stream: accessLogStream}));

// routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/front/auth', frontAuthRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);
app.use('/permission', permissionRoutes);
app.use('/product', productRoutes);
app.use('/front/product', frontProductRoutes);
app.use('/brand', brandRoutes);
app.use('/front/cart', frontCartRoutes);


// errors
app.use((error,req,res,next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    const errorCode = error.errorCode || 1;
    res.status(status).json({message: message, data: data, errorCode: errorCode});
});

//DB
mongoose
    .connect(
        // 'mongodb+srv://julia:0utLbe4oifmYib1N@cluster0-acecb.mongodb.net/cms?retryWrites=true&w=majority',
        process.env.MONGODB_CONNECTION_STRING,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    )
    .then(result => {
        app.listen(process.env.PORT || 5000);
        // const server = app.listen(5000);
        // const io = require('./socket').init(server);
        // io.on('connection', socket => {
        //     console.log('Client connected');
        // })
    })
    .catch(err => {
        console.log(err);
    });
   