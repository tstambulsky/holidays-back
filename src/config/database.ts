export const databaseConfig: IDatabaseConfig = {
  port: parseInt(process.env.DB_PORT) || 5432,
  name: process.env.DB_NAME || 'apidatabase'
};

interface IDatabaseConfig {
  port: number;
  name: string;
  host: string;
}
