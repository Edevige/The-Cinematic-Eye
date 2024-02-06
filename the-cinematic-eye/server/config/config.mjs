const config = {
    port: 3000,
    db :{
        database: process.env.DB_NAME || 'tce' ,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'biar',
        options: {
            dialect: process.env.DIALECT || 'postgres',
            host : process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || '5432',
            //storage: './tce.sqlite'
        }
    },
    authentication: {
       jwtSecret: process.env.JWT_SECRET || 'secret'
    }
};
export default config