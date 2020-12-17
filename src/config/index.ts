export const config = {
    port: process.env.PORT || 4000,
    MONGODB_HOST: process.env.MONGODB_HOST || '127.0.0.1',
    MONGODB_DATABASE: process.env.MONGODB_DB || 'holidays-app',
    MONGODB_PORT: process.env.DB_PORT || '27017',
    secret: process.env.SECRET || 'asd123',
    databseProduction: process.env.DATABASE_URL_PROD
};
