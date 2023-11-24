import mysql from 'mysql2/promise';
import 'dotenv/config';

/* *Cria a conexão com o DB. Os dados ficam salvos na env. O arquivo da env é inserido no gitignore.*/
export const sql = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    });
