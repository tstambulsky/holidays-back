export const databaseConfig: IDatabaseConfig = {
  port: parseInt(process.env.DB_PORT) || 5432,
  name: process.env.DB_NAME || 'apidatabase',
  host: process.env.DB_HOST || 'localhost'
};

interface IDatabaseConfig {
  port: number;
  name: string;
  host: string;
}
