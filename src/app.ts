import express, { Request, Response } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import indexRouter from './routes/index';
import adminRouter from './routes/Admin';
import vendorRouter from './routes/vendor';
import {db} from './config/index';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

//sequelize connection
db.sync().then(()=> {
    console.log("Connection to database established");
}).catch(err => {
    console.log(err);
});


app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

//router middleware
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/vendors', vendorRouter);



//kill all node ------ to stop all servers
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

export default app;