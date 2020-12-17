const mongoose = require('mongoose');
import { config } from './index';

const MONGODB_URI = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DATABASE}`;

export const dbConnect = async () => {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
};
