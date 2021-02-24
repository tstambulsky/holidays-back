export const globalConfig: IGlobalConfig = {
   port: process.env.PORT || '4000',
}

interface IGlobalConfig {
   port: string
}
