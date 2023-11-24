import { randomUUID} from "node:crypto";
import  bcrypt  from 'bcrypt';
import { sql } from "../config/mysql.connection.js";

export default class UsersQuery {
    
    async list(request, reply){

        const search = request.query.search;
        let user;
        
        if (search) {
            [user] = await sql.query('SELECT * FROM users WHERE uuid LIKE ?', `%${search}%`);
        }else{
            try{
                [user] = await sql.query('select * from users');
            }catch(err){
                console.log('Erro: ', err);
            }
        }
        return (user);
    }

    async create(user){
        const userId = randomUUID();
        const { name, fancyname, email, document, phone, password } = user;
        const hash = bcrypt.hashSync(password, 10);

        await sql.query('INSERT INTO users (uuid, name, fancyname, email, document, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, name, fancyname, email, document, phone, hash ]);
    }

    async update(id, user){
        const { name, fancyname, email, document, phone, password } = user;
        await sql.query('UPDATE users SET name = ?, fancyname = ?, email = ?, document = ?, phone = ?, password = ? WHERE uuid = ?', [name, fancyname, email, document, phone, password, id]);

    }

    async delete(id){
        await sql.query(`DELETE FROM users WHERE uuid = '${id}'`);
       console.log(resp);
    }

    async authenticate(type, data) {

        const { login, password } = data;
        const authTypeMap = {
            'email': 'SELECT email, password FROM users WHERE email = ?',
            'document': 'SELECT document, password FROM users WHERE document = ?',
            'phone': 'SELECT phone, name FROM users WHERE phone = ?'
        };

        try {
                const query = authTypeMap[type];
                const [response] = await sql.query(query, [login]);

                if (response.length > 0){

                    if (bcrypt.compareSync(password, response[0].password)){
                        return ({ success: true, message:'Login realizado com sucesso!' });
                    }
                }
                return ({ success: false, message:'Usuário não autenticado!' });
            }catch(err){
                return ({ success: false, message:'Falha na consulta!' });
            }
    }


}