import 'reflect-metadata';
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import useragent from 'express-useragent';
import { config } from './config';
import morgan from 'morgan';
import { dbConnect } from './config/database';

const app: express.Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(useragent.express());

const main = async () => {
    try {
        dbConnect();
        app.listen(config.port, () => {
            console.log(`Server started on port ${config.port}`);
        });
    } catch (e) {
        console.log('An error appear', e);
    }
};

main();

export default app;
