const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const api = process.env.API_URL;
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');


const productRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const orderRouter = require('./routers/orders');
const userRouter = require('./routers/users');

app.use(cors());
app.options('*', cors());



// middleware
app.use(bodyParser.json());
app.use(morgan('tiny')); 
app.use(authJwt());
app.use(errorHandler);

// routers
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/users`, userRouter);



const DB_USER = 'ecommerce_user';
const PASSWORD = encodeURIComponent('mU2Whi$rKYvz4#S'); 

mongoose.connect(`mongodb+srv://${DB_USER}:${PASSWORD}@cluster0.zth85.mongodb.net/ecommerce-api?retryWrites=true&w=majority`,{
    dbname: 'ecommerce_api',
})
.then(()=>{
    console.log('Database Connection is ready...');
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{

    console.log(api);
    console.log('hello World from ecommerce at http://localhost:3000');
})