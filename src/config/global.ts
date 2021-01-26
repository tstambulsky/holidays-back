export const globalConfig: IGlobalConfig = {
  port: process.env.PORT || '4000',
  host: process.env.HOST || '0.0.0.0'
};

interface IGlobalConfig {
  port: string;
  host: string;
}
