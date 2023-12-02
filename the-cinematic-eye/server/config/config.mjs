export default {
    port: 3000,
    db :{
        database: process.env.DB_NAME || 'tce' ,
        user: process.env.DB_USER || 'edvige',
        password: process.env.DB_PASS || 'edvige',
        options: {
            dialect: process.env.DIALECT || 'postgres',
            host : process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || '5432',
            //storage: './tce.sqlite'
        }
    }
}