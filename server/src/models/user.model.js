import { randomUUID} from "node:crypto";
import  bcrypt  from 'bcrypt';
import { sql } from "../config/db.connection.js";

export default class UsersQuery {
    
    async list(request, reply){

        const search = request.query.search;
        let user;
        
        if (search) {
            try{
                [user] = await sql.query('SELECT * FROM users WHERE uuid LIKE ?', `%${search}%`);
                if (user.length > 0)
                    return ({success: true, user})
                else
                    return ({success: false, message: 'Usuário não localizado'})
            }catch(error){
                return ({success: false, message: error});
            }
        }else{
            try{
                [user] = await sql.query('select * from users');
                return ({success: true, user})

            }catch(error){
                return ({success: false, message: error});
            }
        }
    }

    async create(user){
        try{
            const userId = randomUUID();
            const { name, fancyname, email, document, phone, password } = user;
            const hash = bcrypt.hashSync(password, 10);
    
            await sql.query('INSERT INTO users (uuid, name, fancyname, email, document, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, name, fancyname, email, document, phone, hash ]);
            return ({success: true, user})
        }catch (error){
            return ({success: false, message: error});
        }

    }

    async update(id, user){
        try{
            const { name, fancyname, email, document, phone, password } = user;
            await sql.query('UPDATE users SET name = ?, fancyname = ?, email = ?, document = ?, phone = ?, password = ? WHERE uuid = ?', [name, fancyname, email, document, phone, password, id]);
            return ({success: true, message: 'usuário atualizado'})
        }catch(error){
            return ({success: false, message: error})
        }

    }

    async delete(id){
       try{
            await sql.query(`DELETE FROM users WHERE uuid = '${id}'`);
            return ({success: true, message: 'Dados do usuário deletados'});
       }catch(error){
            return({success: false, message: error});
       }
    
    }

    async authenticate(type, data) {

        const { login, password } = data;
        const authTypeMap = {
            'email': 'SELECT email, password, uuid FROM users WHERE email = ?',
            'document': 'SELECT document, password, uuid FROM users WHERE document = ?',
            'phone': 'SELECT phone, password, uuid FROM users WHERE phone = ?'
        };
        try {
                const query = authTypeMap[type];
                const [response] = await sql.query(query, [login]);
                if (response.length > 0){

                    if (bcrypt.compareSync(password, response[0].password)){
                        return ({ success: true, message:'Login realizado com sucesso!' , user: response[0].uuid});
                    }
                }
                return ({ success: false, message:'Usuário não autenticado!' });
            }catch(err){
                return ({ success: false, message:'Falha na consulta!' });
            }
    }


}