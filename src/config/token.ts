export const tokenConfig: ITokenConfig = {
   secretKey: process.env.TOKEN_SECRET,
   expirationDay: '7d',
}

interface ITokenConfig {
   secretKey: string
   expirationDay: string
}
